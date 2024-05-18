const argsHandler = (msgContent) => {
  const args = msgContent.split(" ");

  if (args.length == 1) {
    msg.reply("Please provide a character name");
    return;
  }

  const realm = args[2] ? args[2] : "icecrown";

  return { args, realm };
};

const baseURL = "https://armory.warmane.com";

// class emoji
const cE = {
  "Death Knight": "<:deathknight:1240756073703542894>",
  Druid: "<:druid:1240756076396286043>",
  Hunter: "<:hunter:1240756078610874518>",
  Mage: "<:mage:1240756080464756878>",
  Paladin: "<:paladin:1240756081987424429>",
  Priest: "<:priest:994280218716020836>",
  Rogue: "<:rogue:1240756083891634188>",
  Shaman: "<:shaman:1240756086424993793>",
  Warlock: "<:warlock:1240756088161173595>",
  Warrior: "<:warrior:1240756092514861187>",
};

module.exports = { argsHandler, baseURL, cE };
