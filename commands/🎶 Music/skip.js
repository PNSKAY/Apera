const {
  MessageEmbed,
} = require("discord.js");
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  autoplay,
} = require(`${process.cwd()}/handlers/functions`);
module.exports = {
  name: "skip",
  category: "🎶 Music",
  aliases: ["voteskip", "s", "vs"],
  description: "Skips the current song",
  usage: "skip",
  parameters: {
    "type": "music",
    "activeplayer": true,
    "check_dj": true,
    "previoussong": false
  },
  type: "song",
  run: async (client, message, args, cmduser, text, prefix, es, ls) => {
    //get the channel instance from the Member
    const player = message.client.manager.get(message.guild.id);

        if (!player.queue.current) {
            let thing = new MessageEmbed()
                .setColor("RED")
                .setDescription("There is no music playing.");
         return message.reply({embeds: [thing]});
        }
        const song = player.queue.current;

           player.stop();
           


		let thing = new MessageEmbed()
			.setDescription(` **Skipped**\n[${song.title}](${song.uri})`)
			.setColor(message.client.embedColor)
			.setTimestamp()
		return message.reply({embeds: [thing]}).then(msg => { setTimeout(() => {msg.delete()}, 3000);
       })
	
    }
};
