const { argsHandler, baseURL, cE } = require("../global");
const cheerio = require("cheerio");
const { EmbedBuilder } = require("discord.js");

async function hSummaryCmd(msg) {
  const { args, realm } = argsHandler(msg.content);

  let sSkills = [];

  await fetch(`${baseURL}/character/${args[1]}/${realm}/profile`)
    .then((res) => res.text())
    .then((html) => {
      const $ = cheerio.load(html);

      const secondaryEl = $(".profskills").eq(1);
      secondaryEl.find(".stub").map((_, el) => {
        const text = $(el).text().replace(/\s+/g, " ").trim();
        const m = text.match(/^([A-z ]+)(\d+)/);
        sSkills.push([m[1].trim(), m[2]]);
      });
    });

  await fetch(`${baseURL}/api/character/${args[1]}/${realm}/`)
    .then((res) => res.json())
    .then((json) => {
      //console.log(json);

      // faction emoji
      const fE = () => {
        if (json.faction === "Alliance")
          return "<:alliance:1240726835298439249>";
        else return "<:horde:1240726837374615595>";
      };

      const talents = json.talents
        .map((t) => {
          return `❔ ${t.tree} **${t.points ? t.points.join(" / ") : "?"}**`;
        })
        .join("\n");

      // profession emoji
      const pE = {
        Alchemy: "<:alchemy:1240725929613988022>",
        Blacksmithing: "<:blacksmithing:1240725931706941521>",
        Enchanting: "<:enchanting:1240725935167111218>",
        Engineering: "<:engineering:1240725936853221396>",
        Herbalism: "<:herbalism:1240725941517287544>",
        Inscription: "<:inscription:1240725943169847457>",
        Jewelcrafting: "<:jewelcrafting:1240725945132912680>",
        Leatherworking: "<:leatherworking:1240726020361945168>",
        Mining: "<:mining:1240725949709025311>",
        Skinning: "<:skinning:1240725953840152629>",
        Tailoring: "<:tailoring:1240725955383918702>",
      };
      const professions = json.professions
        .map((p) => {
          return `${pE[p.name]} ${p.name} **${p.skill} / 450**`;
        })
        .join("\n");

      const sE = {
        Cooking: "<:cooking:1240725933413892217>",
        "First Aid": "<:first_aid:1240725938363170989>",
        Fishing: "<:fishing:1240725939906936853>",
      };
      const secondary = sSkills
        .map((s) => {
          return `${sE[s[0]]} ${s[0]} **${s[1]} / 450**`;
        })
        .join("\n");

      const embed = new EmbedBuilder()
        .setColor("#313338")

        .setThumbnail(
          `https://wow.zamimg.com/images/wow/icons/large/race_${json.race
            .replaceAll(" ", "")
            .toLowerCase()}_${json.gender.toLowerCase()}.jpg`
        )
        .addFields(
          {
            name: "Achievement Points",
            value: `**${json.achievementpoints}**`,
            inline: true,
          },
          {
            name: "Status",
            value: json.online ? "**🟢 Online**" : "**🔴 Offline**",
            inline: true,
          },
          { name: "Gear Score", value: `**----**`, inline: true },

          { name: "\u200B", value: "\u200B" },

          {
            name: "Specializations",
            value: talents ? talents : "..?",
            inline: true,
          },
          {
            name: "Player vs. Player",
            value: `${fE()} Total Kills **${
              json.honorablekills
            }**\n${fE()} Kills Today **-**`,
            inline: true,
          },

          { name: "\u200B", value: "\u200B" },

          {
            name: "Professions",
            value: professions ? professions : "None",
            inline: true,
          },
          {
            name: "Secondary Skills",
            value: secondary ? secondary : "None",
            inline: true,
          }
        );

      if (json.level == 80)
        embed.addFields(
          { name: "\u200B", value: "\u200B" },
          { name: "Missing Enchants", value: "-", inline: true },
          { name: "Missing Gems", value: "-", inline: true }
        );

      let description = `[**${json.name}**](${baseURL}/character/${args[1]}/${realm}/profile)`;

      if (json.guild)
        description += ` \\<[**${json.guild}**](${baseURL}/guild/${json.guild}/${realm})>`;

      description += `\nLevel ${json.level} ${json.race}, ${json.class} ${
        cE[json.class]
      }\n*${json.realm}*`;

      embed.setDescription(description);

      msg.channel.send({
        content: `**${json.name}**'s Summary:`,
        embeds: [embed],
      });
    })
    .catch((err) => {
      console.error(err.message);
    });
}

module.exports = hSummaryCmd;
