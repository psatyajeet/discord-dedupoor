import { Client, Message } from "discord.js";

const linkToMessage: Record<string, string> = {};

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
      channelId,
      guildId,
      createdTimestamp,
      author,
    } = message;

    const sharedUrl = message.content.includes("youtube.com")
      ? message.content
      : message.content.split("?")[0];
    const messageUrl = message.url;

    if (linkToMessage[sharedUrl]) {
      await message.reply(
        `Someone posted this link elsewhere! There may already be a discussion, check out ${linkToMessage[sharedUrl]}`
      );
    } else {
      linkToMessage[sharedUrl] = messageUrl;
    }
  }
}
