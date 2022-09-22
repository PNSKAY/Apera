const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const { convertTime } = require('../../utils/convert');
module.exports = {
  name: `grab`,
  category: `🎶 Music`,
  aliases: [`save`, `yoink`],
  description: `Saves the current playing song to your Direct Messages`,
  usage: `grab`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "previoussong": false
  },
  type: "song",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {

    

        if (!player.queue.current) {
            let thing = new MessageEmbed()
            .setColor("#FFC942")
            .setDescription("> There is no music playing.");
            return message.channel.send({embeds: [thing]});
        }

        const song = player.queue.current
        const total = song.duration;
        const current = player.position;

        const dmbut = new MessageButton().setLabel("Check Your Dm").setStyle("LINK").setURL(`https://discord.com/users/${client.id}`)
        const row = new MessageActionRow().addComponents(dmbut)

        let dm = new MessageEmbed()
        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL()})
        .setDescription(`:mailbox_with_mail: \`Check Your Dms!\``)
        .setColor(client.embedColor)
        .setFooter({text: `Requested By ${message.author.tag}`})
        .setTimestamp()
        message.reply({embeds: [dm], components: [row]})
        
        const urlbutt = new MessageButton().setLabel("Search").setStyle("LINK").setURL(song.uri)
        const row2 = new MessageActionRow().addComponents(urlbutt)
        let embed = new MessageEmbed()
            .setDescription(`**Song Details** \n\n > \`[ Song Name ]\`: [${song.title}](${song.uri}) \n > \`[ Song Duration ]\`: \`[${convertTime(song.duration)}]\` \n > \`[ Song Played By ]\`: [<@${song.requester.id}>] \n > \`[ Song Saved By ]\`: [<@${message.author.id}>]`)
            .setThumbnail(song.displayThumbnail())
            .setColor(client.embedColor)
            .addField("\u200b", `\`${convertTime(current)} / ${convertTime(total)}\``)
         return message.author.send({embeds: [embed], components: [row2]})
            
    }
};