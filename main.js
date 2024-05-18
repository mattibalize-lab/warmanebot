const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});
const hAchievCmd = require("./cmd/achievements");
const hSummaryCmd = require("./cmd/summary");
require("dotenv").config();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;
  const content = msg.content.toLowerCase();

  if (content.startsWith("!achi") || content.startsWith("!achievements")) {
    hAchievCmd(msg);
  } else if (content.startsWith("!summary")) {
    hSummaryCmd(msg);
  }
});

client.login(process.env.BOT_TOKEN);
