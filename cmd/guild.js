const { baseURL } = require("../global");

async function hGuildCmd(msg) {
  const args = msg.content.split(" ");

  await fetch(`${baseURL}/api/guild/${args[1]}/icecrown/`)
    .then((res) => res.json())
    .then((json) => {
      let onlinePlayers = [];
      json.roster.map((m) => {
        if (m.online) onlinePlayers.push(m.name);
      });

      msg.reply(
        `${args[1]}, ${json.roster.length} members, ${onlinePlayers.length} online.`
      );
      msg.reply(onlinePlayers.join(", "));
    });
}

module.exports = hGuildCmd;
