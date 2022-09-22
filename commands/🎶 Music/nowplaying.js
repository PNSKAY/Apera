const { MessageEmbed } = require("discord.js");
const { convertTime } = require('../../utils/convert.js');
const { progressbar } = require('../../utils/progressbar.js')
module.exports = {
  name: `nowplaying`,
  category: `🎶 Music`,
  aliases: [`np`, "trackinfo"],
  description: `Shows detailled information about the current Song`,
  usage: `nowplaying`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "previoussong": false
  },
  type: "song",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    //if no current song return error
    const player1 = message.client.manager.get(message.guild.id);
        if (!player.queue.current) {
            let thing = new MessageEmbed()
                .setColor("RED")
                .setDescription("There is no music playing.");
            return message.channel.send(thing);
        }
        const song = player.queue.current
        var total = song.duration;
        var current = player.position;
        
        let embed = new MessageEmbed()
            .setDescription(`<a:playing:919580939720482816> **Now Playing**\n[${song.title}](${song.uri}) - \`[${convertTime(song.duration)}]\`- [${song.requester}] \n\n${progressbar(player1)}`)
            .setThumbnail(`https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`)
            .setColor(client.embedColor)
            .addField("\u200b", `\`${convertTime(current)} / ${convertTime(total)}\``)
            return message.channel.send({embeds: [embed]})
  }
};
