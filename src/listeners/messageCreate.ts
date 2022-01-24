import { Client, Message } from "discord.js";
import normalizeUrl from "normalize-url";
import urlRegex from "url-regex";
import prisma from "../prismaClient";

export function getUrlFromMessage(
  message: string,
  strict = true
): string | null {
  const urlMatch = message.match(urlRegex({ strict }));

  if (urlMatch) {
    const url = urlMatch[0];
    if ([",", "."].includes(url.charAt(url.length - 1))) {
      return url.slice(0, url.length - 1);
    }
    return url;
  }

  return strict ? getUrlFromMessage(message, false) : null;
}

export function getNormalizedUrl(url: string): string {
  const defaultParams = { normalizeProtocol: true, forceHttps: true };
  return url.includes("youtube.com")
    ? normalizeUrl(url, { ...defaultParams })
    : normalizeUrl(url, {
        removeQueryParameters: true,
        ...defaultParams,
      });
  // return url.includes("youtube.com") ? url : url.split("?")[0];
}

export async function saveMessage(
  guildDiscordId: number,
  channelDiscordId: number,
  messageDiscordId: number,
  authorDiscordId: number,
  messageUrl: string,
  discordTimestamp: Date,
  content: string,
  sharedUrl: string,
  username: string,
  discriminator: string
) {
  const result = await prisma.message.create({
    data: {
      discordId: messageDiscordId,
      messageUrl,
      discordTimestamp,
      content,
      sharedUrl,
      author: {
        connectOrCreate: {
          where: {
            discordId: authorDiscordId,
          },
          create: {
            discordId: authorDiscordId,
            username,
            discriminator,
          },
        },
      },
      channel: {
        connectOrCreate: {
          where: {
            discordId: channelDiscordId,
          },
          create: {
            discordId: channelDiscordId,
            guild: {
              connectOrCreate: {
                where: {
                  discordId: guildDiscordId,
                },
                create: {
                  discordId: guildDiscordId,
                },
              },
            },
          },
        },
      },
      guild: {
        connectOrCreate: {
          where: {
            discordId: guildDiscordId,
          },
          create: {
            discordId: guildDiscordId,
          },
        },
      },
    },
  });

  if (result) {
    console.log(
      `Saved ${result.content} at ${result.discordTimestamp} as new entry with id ${result.id} `
    );
  }

  return result;
}

export async function handleMessage(
  client: Client,
  message: Message
): Promise<void> {
  const parsedUrl = getUrlFromMessage(message.content);

  if (!parsedUrl) {
    console.log(`No url in message "${message.content}"`);
    return;
  }

  const {
    id: messageDiscordId,
    channelId: channelDiscordId,
    guildId: guildDiscordId,
    createdTimestamp,
    author,
    content,
  } = message;
  const { id: authorDiscordId, username, discriminator } = author;

  console.log(
    messageDiscordId,
    channelDiscordId,
    guildDiscordId,
    authorDiscordId,
    createdTimestamp
  );

  if (
    !messageDiscordId ||
    !channelDiscordId ||
    !guildDiscordId ||
    !authorDiscordId
  ) {
    return;
  }

  const sharedUrl = getNormalizedUrl(parsedUrl); // The URL that was shared
  const messageUrl = message.url; // Discord URL for the message

  const dbMessage = await prisma.message.findFirst({
    where: {
      sharedUrl,
      channel: { guild: { discordId: parseInt(guildDiscordId) } },
    },
    include: { author: true },
  });

  if (dbMessage) {
    await message.reply(
      `@${dbMessage.author.username} posted this link earlier! There may be a discussion already, check out ${dbMessage.messageUrl}`
    );
  } else {
    await saveMessage(
      parseInt(guildDiscordId),
      parseInt(channelDiscordId),
      parseInt(messageDiscordId),
      parseInt(authorDiscordId),
      messageUrl,
      new Date(createdTimestamp),
      content,
      sharedUrl,
      username,
      discriminator
    );
  }
}

export default (client: Client): void => {
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    try {
      await handleMessage(client, message);
    } catch (err) {
      console.log(err);
    }
  });
};
