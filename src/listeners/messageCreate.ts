import { PrismaClient } from "@prisma/client";
import { Client, Message } from "discord.js";

const prisma = new PrismaClient();

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

async function handleMessage(client: Client, message: Message): Promise<void> {
  if (message.content.includes("https://")) {
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

    const sharedUrl = content.includes("youtube.com")
      ? content
      : content.split("?")[0];
    const messageUrl = message.url;

    const dbMessage = await prisma.message.findFirst({
      where: { sharedUrl, guildId: parseInt(guildDiscordId) },
      include: { author: true },
    });

    if (dbMessage) {
      await message.reply(
        `@${dbMessage.author.username} posted this link earlier! There may be a discussion already, check out ${dbMessage.messageUrl}`
      );
    } else {
      await prisma.message.create({
        data: {
          discordId: parseInt(messageDiscordId),
          messageUrl,
          discordTimestamp: new Date(createdTimestamp),
          content,
          sharedUrl,
          author: {
            connectOrCreate: {
              where: {
                discordId: parseInt(authorDiscordId),
              },
              create: {
                discordId: parseInt(authorDiscordId),
                username,
                discriminator,
              },
            },
          },
          channel: {
            connectOrCreate: {
              where: {
                discordId: parseInt(channelDiscordId),
              },
              create: {
                discordId: parseInt(channelDiscordId),
                guild: {
                  connectOrCreate: {
                    where: {
                      discordId: parseInt(guildDiscordId),
                    },
                    create: {
                      discordId: parseInt(guildDiscordId),
                    },
                  },
                },
              },
            },
          },
        },
      });
    }
  }
}
