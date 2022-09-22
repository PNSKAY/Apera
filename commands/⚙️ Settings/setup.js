var {
  MessageEmbed
} = require(`discord.js`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const {
  MessageButton,
  MessageActionRow,
} = require('discord.js')
module.exports = {
  name: "setup",
  category: "⚙️ Settings",
  aliases: ["setupmusic"],
  cooldown: 10,
  usage: "setup-music #Channel",
  description: "Setup a Music Request Channel",
  memberpermissions: ["ADMINISTRATOR"],
  type: "music",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls) => {

    var embeds = [
        new MessageEmbed()
        .setColor()
        .setImage("https://media.discordapp.net/attachments/931893471667712071/933004403118604368/20220110_223609.jpg?width=1193&height=671")
        .setTitle(`**Nothing playing right now**`)
        .setDescription(`[Invite](https://discord.com/api/oauth2/authorize?client_id=908633471797301268&permissions=8&scope=bot%20applications.commands) ~ [Support Server](https://discord.gg/vfJRp2n3WW)`)
      ]
      
      //now we add the components!
      var components = [
        
        new MessageActionRow().addComponents([
          new MessageButton().setStyle('SECONDARY').setCustomId('vdown').setEmoji(`🔉`).setDisabled(),
          new MessageButton().setStyle('SECONDARY').setCustomId('previous').setEmoji(`⏮️`).setDisabled(),
          new MessageButton().setStyle('SECONDARY').setCustomId('Pause').setEmoji('⏯️').setDisabled(),
          new MessageButton().setStyle('SECONDARY').setCustomId('next').setEmoji('⏭️').setDisabled(),
          new MessageButton().setStyle('SECONDARY').setCustomId('vup').setEmoji('🔊').setDisabled(),
        ]),
        new MessageActionRow().addComponents([
          new MessageButton().setStyle('SECONDARY').setCustomId('Rewind').setEmoji(`⏪`).setDisabled(),
          new MessageButton().setStyle('SECONDARY').setCustomId('autoplay').setEmoji(`♾️`).setDisabled(),
          new MessageButton().setStyle('SECONDARY').setCustomId('stop').setEmoji('⏹').setDisabled(),
          new MessageButton().setStyle('SECONDARY').setCustomId('loop').setEmoji('🔁').setDisabled(),
          new MessageButton().setStyle('SECONDARY').setCustomId('Forward').setEmoji('⏩').setDisabled(),
        ]),
      ]
      let channel = message.mentions.channels.first();
      const reply = new MessageEmbed()
      reply.setDescription("<:wrong:927437620882059304> **| You forgot to ping a Channel!**")
      if (!channel) return message.reply({embeds: [reply]})
      //send the data in the channel.
      
      channel.send({ content: "**Join a voice channel and queue songs by name/url.**", embeds, components}).then(msg => {
        client.musicsettings.set(message.guild.id, channel.id, "channel");
        client.musicsettings.set(message.guild.id, msg.id, "message");
  
        reply.setDescription(`** <:right:927434790087577600> | Successfully setupped the Music System in** <#${channel.id}>`)
        //send a success message
        return message.reply({embeds: [reply]})
      });
    },
  };
  
