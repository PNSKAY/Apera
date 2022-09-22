const {
  MessageEmbed
} = require(`discord.js`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
module.exports = {
  name: `nightcore`,
  category: `👀 Filter`,
  aliases: [``],
  description: `Applies a Nightcore Filter`,
  usage: `nightcore`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "previoussong": false
  },
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {
    player.node.send({
      op: "filters",
      guildId: message.guild.id,
      equalizer: player.bands.map((gain, index) => {
        var Obj = {
          "band": 0,
          "gain": 0,
        };
        Obj.band = Number(index);
        Obj.gain = Number(gain)
        return Obj;
      }),
      timescale: {
        "speed": 1.165,
        "pitch": 1.125,
        "rate": 1.05
      },
    });
    player.set("filter", "👻 Nightcore");
    if (!message.channel) return;
    return message.channel.send({
      embeds: [new MessageEmbed()
        .setColor(es.color)
        .setTitle(`Enabled Nightcore`)
        
      ]
    });

  }
};

