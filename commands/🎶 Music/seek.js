const {
  MessageEmbed
} = require(`discord.js`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  createBar,
  format,
  handlemsg
} = require(`${process.cwd()}/handlers/functions`);
module.exports = {
  name: `seek`,
  category: `🎶 Music`,
  aliases: [`vol`],
  description: `Changes the position(seek) of the Song`,
  usage: `seek <Duration in Seconds>`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "check_dj": true,
    "previoussong": false
  },
  type: "song",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    //if number is out of range return error
    if (Number(args[0]) < 0 || Number(args[0]) >= player.queue.current.duration / 1000)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(`Do ${prefix}seek \`eg 100\``)
        ]
      });
    //seek to the position
    player.seek(Number(args[0]) * 1000);
    //send success message
    return message.reply({
      embeds: [new MessageEmbed()
        .setTitle(`succesfully seeked`)
        .addField(`Progress: `, createBar(player))
        .setColor(es.color)
      ]
    });
  }
};
