const {
  MessageEmbed
} = require(`discord.js`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
module.exports = {
  name: `loop`,
  category: `🎶 Music`,
  aliases: [`repeat`, `l`],
  description: `Repeats the current song`,
  usage: `loopsong`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "check_dj": true,
    "previoussong": false
  },
  type: "queuesong",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    //if no args send error
    if (!args[0])
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(client.la[ls].cmds.music.loop.errortitle)
          .setDescription(client.la[ls].cmds.music.loop.errordescription)
        ]
      });
    //if arg is somehow song / track
    if (args[0].toLowerCase() === `song` || args[0].toLowerCase() === `track` || args[0].toLowerCase() === `s` || args[0].toLowerCase() === `t`) {
      //Create the Embed
      let embed = new MessageEmbed()
        .setTitle(player.trackRepeat ? client.la[ls].cmds.music.loop.track.disabled : client.la[ls].cmds.music.loop.track.enabled)
        .setColor(es.color)

      //If Queue loop is enabled add embed info + disable it
      if (player.queueRepeat) {
        embed.setDescription(client.la[ls].cmds.music.loop.andqueue);
        player.setQueueRepeat(false);
      }
      //toggle track repeat to the reverse old mode
      player.setTrackRepeat(!player.trackRepeat);
      //Send Success Message
      return message.reply({
        embeds: [embed]
      })
    }
    //if input is queue
    else if (args[0].toLowerCase() === `queue` || args[0].toLowerCase() === `qu` || args[0].toLowerCase() === `q`) {
      //Create the Embed
      let embed = new MessageEmbed()
        .setTitle(`${player.queueRepeat ? `<a:yes:833101995723194437> **Enabled Autoplay**`: `<:no:833101993668771842> **Disabled Autoplay**`}`)
        .setColor(es.color)

      //If Track loop is enabled add embed info + disable it
      if (player.trackRepeat) {
        embed.setDescription(`Track Loop is Enabled`);
        player.setTrackRepeat(false);
      }
      //toggle queue repeat to the reverse old mode
      player.setQueueRepeat(!player.queueRepeat);
      //Send Success Message
      return message.reply({
        embeds: [embed]
      });
    } else if (args[0].toLowerCase() === `off` || args[0].toLowerCase() === `stop`) {
      //Create the Embed
      let embed = new MessageEmbed()
        .setTitle(`Succesfully Disabled`)
        .setColor(es.color)
        
      player.setTrackRepeat(false);
      player.setQueueRepeat(false);
      return message.reply({
        embeds: [embed]
      });
    }
    //if no valid inputs, send error
    else {
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(`An Error Occured`)
          
        ]
      });
    }
  }
};
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/discord-js-lavalink-Music-Bot-erela-js
 * @INFO
 * Work for Milrato Development | https://milrato.dev
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
