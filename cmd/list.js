async function hListCmd(msg, db) {
  const args = msg.content.split(" ");

  if (args.length == 1) {
    const char = db
      .prepare("SELECT * FROM characters WHERE uid = ?")
      .all(msg.author.id);

    if (!char.length)
      return msg.reply(
        "You have no characters added. Use `!list add <name>` to add a character."
      );

    return msg.reply(
      `Characters for ${msg.author.username}:\n${char
        .map(
          (c) =>
            `[${c.name}](https://armory.warmane.com/character/${c.name}/Icecrown)`
        )
        .join("\n")}`
    );
  }
  if (args[1].startsWith("<@")) {
    const user = msg.mentions.users.first();
    if (!user) return msg.reply("Please provide a valid discord user.");

    const char = db
      .prepare("SELECT * FROM characters WHERE uid = ?")
      .all(user.id);
    if (!char.length) return msg.reply("No characters found for this user.");
    return msg.reply(
      `Characters for ${user.username}:\n${char
        .map(
          (c) =>
            `[${c.name}](https://armory.warmane.com/character/${c.name}/Icecrown)`
        )
        .join("\n")}`
    );
  }

  // subcommands
  if (args[1] === "add") {
    if (args[2]) {
      try {
        db.prepare("INSERT INTO characters (name, uid) VALUES (?, ?)").run(
          args[2],
          msg.author.id
        );
      } catch (err) {
        if (err.message.includes("UNIQUE"))
          return msg.reply(
            "Character was already added to someone else. If you think this is an error, please contact an admin."
          );
        else console.error(err.message);
      }
      return msg.reply("Character added successfully.");
    } else return msg.reply("Please provide a character name.");
  }
  if (args[1] === "del") {
    if (msg.author.id == "156165749889695744") {
      db.prepare("DELETE FROM characters WHERE name = ? AND uid = ?").run(
        args[2],
        msg.author.id
      );
      return msg.reply("Character deleted successfully.");
    } else msg.reply("Admin only command.");
  }
}

module.exports = hListCmd;
