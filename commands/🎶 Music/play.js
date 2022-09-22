const {
  MessageEmbed
} = require(`discord.js`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const playermanager = require(`${process.cwd()}/handlers/playermanager`);
module.exports = {
  name: `play`,
  category: `🎶 Music`,
  aliases: [`p`],
  description: `Plays a song from youtube`,
  usage: `play <Song / URL>`,
  parameters: {
    "type": "music",
    "activeplayer": false,
    "previoussong": false
  },
  type: "queuesong",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    //if no args return error
    if (!args[0])
      return message.reply({
       });
    if (args.join("").includes("soundcloud")) {
      playermanager(client, message, args, `song:soundcloud`);
    } else if (args.join("").includes("spotify")) {
      playermanager(client, message, args, `song:raw`);
    } else if (args.join("").includes("apple")) {
      playermanager(client, message, args, `song:raw`);
    } else {
      //play from YOUTUBE
      playermanager(client, message, args, `song:youtube`);
    }
  }
};
