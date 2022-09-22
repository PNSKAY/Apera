const {
  MessageEmbed
} = require(`discord.js`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
module.exports = {
  name: `removedj`,
  aliases: [`deletedj`],
  category: `⚙️ Settings`,
  description: `Let's you DELETE a DJ ROLE`,
  usage: `removedj @ROLE`,
  memberpermissions: [`ADMINISTRATOR`],
  type: "music",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    //get the role of the mention
    let role = message.mentions.roles.filter(role => role.guild.id == message.guild.id).first();
    //if no pinged role return error
    if (!role)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
      
          .setTitle(`Please Mention A Role`)
        ]
      });
    //try to find the role in the guild just incase he pings a role of a different server
    try {
      message.guild.roles.cache.get(role.id);
    } catch {
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          
          .setTitle(`You Pinged A Role Of Different Server`)
        ]
      });
    }
    //if its not in the database return error
    if (!client.settings.get(message.guild.id, `djroles`).includes(role.id))
      return message.reply({
        embeds: [new MessageEmbed()
          .setTitle(`**This Role is not a DJ-Role!**`)
        ]
      });
    //remove it from the Database
    client.settings.remove(message.guild.id, role.id, `djroles`);
    //These lines create the String for all left Roles
    var leftb = client.settings.get(message.guild.id, `djroles`).map(r => `<@&${r}>`);
    if (leftb.length == 0) leftb = client.la[ls]["common"]["nodjs"];
    else leftb.join(", ");
    //send the success message
    return message.reply({
      embeds: [new MessageEmbed()
        .setColor(es.color)
        
        .setTitle(`Succesfully removed the dj role`)
       
      ]
    });
  }
};
