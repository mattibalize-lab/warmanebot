const argsHandler = (msgContent) => {
  const args = msgContent.split(" ");

  if (args.length == 1) {
    msg.reply("Please provide a character name");
    return;
  }

  const realm = args[2] ? args[2] : "icecrown";

  return { args, realm };
};

module.exports = argsHandler;
