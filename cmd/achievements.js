const cheerio = require("cheerio");

// Category, Achievements[Normal, Heroic]
const catgAch = [
  [14922, [4817, 4818]], // Lich King 10-Player Raid
  [14923, [4815, 4816]], // Lich King 25-Player Raid

  [14961, [2984, 3159]], // Secrets of Ulduar 10
  [14962, [2895, 3164]], // SoU 25

  [15001, [3917, 3918]], // Call of the Crusade 10
  [15002, [3916, 3812]], // CotC 25

  [15041, [4532, 4636]], // Fall of the Lich King 10
  [15042, [4608, 4637]], // FotLK 25
];

async function hAchievCmd(msg) {
  const args = msg.content.split(" ");

  if (args.length == 1) {
    msg.reply("Please provide a character name");
    return;
  }

  const b = Array.from({ length: 8 }, () => ["❌", "❌"]);
  let error = false,
    notFound = false;

  for (let i = 0; i < catgAch.length; i++) {
    if (error)
      return msg.channel.send("An error occurred. Please try again later.");

    if (notFound)
      return msg.reply(
        "The character you are looking for does not exist or does not meet the minimum required level."
      );
    await fetch(
      `https://armory.warmane.com/character/${args[1]}/icecrown/achievements`,
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
        body: `category=${catgAch[i][0]}`,
        method: "POST",
      }
    )
      .then((res) => res.json())
      .then((json) => {
        const $ = cheerio.load(json.content);
        for (let j = 0; j < 2; j++)
          if ($(`#ach${catgAch[i][1][j]} > .date`).length) b[i][j] = "✅";
      })
      .catch((err) => {
        if (err.message.includes("Unexpected token")) notFound = true;
        else {
          console.error(err.message);
          error = true;
        }
      });
  }

  let table = `Raid   | 10NM 10HC 25NM 25HC
${"-".repeat(28)}
ICC    |  ${b[6][0]}   ${b[6][1]}   ${b[7][0]}   ${b[7][1]}
RS     |  ${b[0][0]}   ${b[0][1]}   ${b[1][0]}   ${b[1][1]}
TOC    |  ${b[4][0]}   ${b[4][1]}   ${b[5][0]}   ${b[5][1]}
ULDUAR |  ${b[2][0]}   ${b[2][1]}   ${b[3][0]}   ${b[3][1]}`;

  msg.channel.send(
    `**${args[1]}'s achievements**:` + "```fix\n" + table + "```"
  );
}

module.exports = hAchievCmd;
