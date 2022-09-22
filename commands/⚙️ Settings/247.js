const { MessageEmbed } = require("discord.js");

module.exports = {
    name: `247`,
    aliases: [`24h`],
    category: `⚙️ Settings`,
    description: `Let's you define a DJ ROLE (as an array, aka you can have multiple)`,
    usage: `adddj @role`,
    memberpermissions: [`ADMINISTRATOR`],
    type: "music",
    run: async (client, message, args, cmduser, text, prefix, es, ls) => {

        const player = message.client.manager.players.get(message.guild.id);
    if (player.twentyFourSeven) {
      player.twentyFourSeven = false;
      const embed = new MessageEmbed()
       .setColor(client.embedColor)
       .setDescription(`24/7 mode is now off.`)
      return message.reply({embeds: [embed]});
    }
    else {
      player.twentyFourSeven = true;
      const embed = new MessageEmbed()
       .setColor(client.embedColor)
       .setDescription(`24/7 mode is now on.`)
      
      return message.reply({embeds: [embed]});
    }

    }
}