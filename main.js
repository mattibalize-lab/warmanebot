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
const hListCmd = require("./cmd/list");
const hGuildCmd = require("./cmd/guild");
const hSummaryCmd = require("./cmd/summary");

require("dotenv").config();

const Database = require("better-sqlite3");
const db = new Database("./database.db");
console.log("Database connected.");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;

  if (msg.author.lastCommand && msg.author.lastCommand + 1500 > Date.now())
    return msg.reply(
      "Please wait a few seconds before sending another command."
    );

  const content = msg.content.toLowerCase();

  if (content.startsWith("!")) {
    if (content.startsWith("!achi") || content.startsWith("!achievements"))
      hAchievCmd(msg);
    else if (
      content.startsWith("!alts") ||
      content.startsWith("!characters") ||
      content.startsWith("!list")
    )
      hListCmd(msg, db);
    else if (content.startsWith("!ginfo") || content.startsWith("!guild"))
      hGuildCmd(msg);
    else if (content.startsWith("!summary")) {
      console.log("I did this?");
      hSummaryCmd(msg, db);
    }

    msg.author.lastCommand = Date.now();
  }
});

client.login(process.env.BOT_TOKEN);

module.exports = db;
