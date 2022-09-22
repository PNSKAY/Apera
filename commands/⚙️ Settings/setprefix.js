const {
  MessageEmbed
} = require(`discord.js`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
module.exports = {
  name: `prefix`,
  category: `⚙️ Settings`,
  description: `Let's you change the Prefix of the BOT`,
  usage: `prefix <NEW PREFIX>`,
  memberpermissions: [`ADMINISTRATOR`],
  type: "bot",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    //if no args return error
    if (!args[0])
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(`please type some symbol`)
          
        ]
      });
    //if there are multiple arguments
    if (args[1])
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(`multiple arguments`)
        ]
      });
    //if the prefix is too long
    if (args[0].length > 3)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(`Prefix is too long`)
        ]
      });
    //set the new prefix
    client.settings.set(message.guild.id, args[0], `prefix`);
    //return success embed
    return message.reply({
      embeds: [new MessageEmbed()
        .setColor(es.color)
      
        .setTitle(`succesfully setuped the prefix`)
      ]
    });
  }
};
