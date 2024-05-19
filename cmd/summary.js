const { argsHandler, baseURL, cE } = require("../global");
const cheerio = require("cheerio");
const { EmbedBuilder } = require("discord.js");

async function hSummaryCmd(msg) {
  const { args, realm } = argsHandler(msg);
  if (!args[1] || !realm) return;

  let killsToday,
    sSkills = [];

  await fetch(`${baseURL}/character/${args[1]}/${realm}/profile`)
    .then((res) => res.text())
    .then((html) => {
      const $ = cheerio.load(html);

      killsToday = $(".pvpbasic").find(".stub").eq(1).text().match(/\d+/)[0];

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
      // faction emoji
      const fE = () => {
        if (json.faction === "Alliance")
          return "<:alliance:1240726835298439249>";
        else return "<:horde:1240726837374615595>";
      };

      const tE = {
        "Death Knight": {
          Blood: "<:spell_deathknight_bloodpresence:1241533988800041030>",
          Frost: "<:spell_deathknight_frostpresence:1241533990230294641>",
          Unholy: "<:spell_deathknight_unholypresence:1241533991572734023>",
        },

        Druid: {
          Balance: "<:spell_nature_starfall:1241534029409292359>",
          "Feral Combat": "<:ability_racial_bearform:1241534026695577651>",
          Restoration: "<:spell_nature_healingtouch:1241534027878371360>",
        },

        Hunter: {
          "Beast Mastery": "<:ability_hunter_beasttaming:1241534056894562324>",
          Marksman: "<:ability_marksmanship:1241534059520458833>",
          Survival: "<:ability_hunter_swiftstrike:1241534058052325480>",
        },

        Mage: {
          Arcane: "<:spell_holy_magicalsentry:1241534095809445970>",
          Fire: "<:spell_fire_firebolt02:1241534093049593867>",
          Frost: "<:spell_frost_frostbolt02:1241534094635176038>",
        },

        Paladin: {
          Holy: "<:spell_holy_holybolt:1241534128470622248> ",
          Protection: "<:spell_holy_devotionaura:1241534127086506015>",
          Retribution: "<:spell_holy_auraoflight:1241534125438144663>",
        },

        Priest: {
          Discipline: " <:spell_holy_wordfortitude:1241534155465031691>",
          Holy: "<:spell_holy_guardianspirit:1241534153904885832>",
          Shadow: "<:spell_shadow_shadowwordpain:1241534157025316944>",
        },

        Rogue: {
          Assassination: "<:ability_rogue_eviscerate:1241534184292487278>",
          Combat: "<:ability_backstab:1241534182899843072>",
          Subtlety: "<:ability_stealth:1241534186314141716>",
        },

        Shaman: {
          Elemental: "<:spell_nature_lightning:1241534212629074063>",
          Enhancement: "<:spell_nature_lightningshield:1241534214256459896>",
          Restoration: "<:spell_nature_magicimmunity:1241534215217086537>",
        },

        Warlock: {
          Affliction: "<:spell_shadow_deathcoil:1241534461951348787>",
          Demonology: "<:spell_shadow_metamorphosis:1241534463263903896>",
          Destruction: "<:spell_shadow_rainoffire:1241534464513937598>",
        },

        Warrior: {
          Arms: "<:ability_rogue_eviscerate:1241534184292487278>",
          Fury: "<:ability_warrior_innerrage:1241534494981488670>",
          Protection: "<:inv_shield_06:1241534496277270690>",
        },
      };
      const talents = json.talents
        .map((t) => {
          return `${tE[json.class][t.tree]} ${t.tree} **${
            t.points ? t.points.join(" / ") : "?"
          }**`;
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
            }**\n${fE()} Kills Today **${killsToday}**`,
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

      if (json.level > 69)
        embed.addFields(
          { name: "\u200B", value: "\u200B" },
          { name: "Missing Enchants", value: "-", inline: true },
          { name: "Missing Gems", value: "-", inline: true },
          { name: "PvP Gear", value: "-", inline: true }
        );

      let description = `[**${json.name}**](${baseURL}/character/${args[1]}/${realm}/profile)`;

      if (json.guild)
        description += ` \\<[**${
          json.guild
        }**](${baseURL}/guild/${json.guild.replaceAll(" ", "+")}/${realm})>`;

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
