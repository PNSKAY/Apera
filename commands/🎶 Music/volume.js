const {
  MessageEmbed
} = require(`discord.js`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
module.exports = {
  name: `volume`,
  category: `🎶 Music`,
  aliases: [`vol`],
  description: `Changes the Volume`,
  usage: `volume <0-150>`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "check_dj": true,
    "previoussong": false
  },
  type: "queuesong",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    //if the Volume Number is out of Range return error msg
    if (Number(args[0]) <= 0 || Number(args[0]) > 150)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(`Cant set more than 150`)
          
        ]
      });
    //if its not a Number return error msg
    if (isNaN(args[0]))
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(`Give The Number 1 - 150`)
          
        ]
      });
    //change the volume
    player.setVolume(Number(args[0]));
    //send success message
    return message.reply({
      embeds: [new MessageEmbed()
        .setTitle(`Succesfully set the volume`)
        .setColor(es.color)
      ]
    });

  }
};
