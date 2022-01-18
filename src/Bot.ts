import { Client, Intents } from "discord.js";
import "dotenv/config";
import messageCreate from "./listeners/messageCreate";
import ready from "./listeners/ready";

console.log("Bot is starting...");

const token = process.env.TOKEN;
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  partials: ["MESSAGE", "CHANNEL"],
});

ready(client);
messageCreate(client);

client.login(token);
