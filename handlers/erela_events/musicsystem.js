const {
  MessageEmbed,
  MessageButton,
  MessageActionRow,
  MessageSelectMenu
} = require("discord.js")
const {
  check_if_dj,
  autoplay,
  escapeRegex,
  format,
  duration,
  createBar,
  delay
} = require("../functions");
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const playermanager = require(`${process.cwd()}/handlers/playermanager`);
const { convertTime } = require('../../utils/convert.js');
//we need to create the music system, somewhere...
module.exports = client => {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton() && !interaction.isSelectMenu()) return;
    var {
      guild,
      message,
      channel,
      member,
      user
    } = interaction;
    if (!guild) guild = client.guilds.cache.get(interaction.guildId);
    if (!guild) return;
    const es = client.settings.get(guild.id, "embed")
    const ls = client.settings.get(guild.id, "language")
    const prefix = client.settings.get(guild.id, "prefix");
    var data = client.musicsettings.get(guild.id);
    const musicChannelId = data.channel;
    const musicChannelMessage = data.message;
    //if not setupped yet, return
    if (!musicChannelId || musicChannelId.length < 5) return;
    if (!musicChannelMessage || musicChannelMessage.length < 5) return;
    //if the channel doesnt exist, try to get it and the return if still doesnt exist
    if (!channel) channel = guild.channels.cache.get(interaction.channelId);
    if (!channel) return;
    //if not the right channel return
    if (musicChannelId != channel.id) return;
    //if not the right message, return
    if (musicChannelMessage != message.id) return;

    if (!member) member = guild.members.cache.get(user.id);
    if (!member) member = await guild.members.fetch(user.id).catch(() => {});
    if (!member) return;
    //if the member is not connected to a vc, return
    if (!member.voice.channel) return interaction.reply({
      ephemeral: true,
      content: ":x: **Please Connect to a Voice Channel first!**"
    })
    //now its time to start the music system
    if (!member.voice.channel)
      return interaction.reply({
        content: `<:no:833101993668771842> **Please join a Voice Channel first!**`,
        ephemeral: true
      })

    var player = client.manager.players.get(interaction.guild.id);
    //if not connected to the same voice channel, then make sure to connect to it!
    if (player && member.voice.channel.id !== player.voiceChannel)
      return interaction.reply({
        content: `<:no:833101993668771842> **Please join __my__ Voice Channel first! <#${player.voiceChannel}>**`,
        ephemeral: true
      })
    if (interaction.isButton()) {
      if (!player || !player.queue || !player.queue.current) {
        return interaction.reply({
          content: "<:no:833101993668771842> Nothing Playing yet",
          ephemeral: true
        })
      }
      //here i use my check_if_dj function to check if he is a dj if not then it returns true, and it shall stop!
      if (player && interaction.customId != `Lyrics` && check_if_dj(client, member, player.queue.current)) {
        return interaction.reply({
          embeds: [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(`<:no:833101993668771842> **You are not a DJ and not the Song Requester!**`)
            .setDescription(`**DJ-ROLES:**\n${check_if_dj(client, interaction.member, player.queue.current)}`)
          ],
          ephemeral: true
        });
      }
      switch (interaction.customId) {
        case "skip": {
          //if ther is nothing more to skip then stop music and leave the Channel
          if (!player.queue || !player.queue.size || player.queue.size === 0) {
            //if its on autoplay mode, then do autoplay before leaving...
            if (player.get("autoplay")) return autoplay(client, player, "skip");
            interaction.reply({content: `Stopped Playing`, ephemeral: true})
            await player.destroy()
            //edit the message so that it's right!
            var data = generateQueueEmbed(client, guild.id, true)
            message.edit(data).catch((e) => {
              //console.log(e.stack ? String(e.stack).grey : String(e).grey)
            })
            return
          }
          //skip the track
          await player.stop();
          interaction.reply({content: `⏭ **Skipped to the next Song!**`, ephemeral: true})
          //edit the message so that it's right!
          var data = generateQueueEmbed(client, guild.id)
          message.edit(data).catch((e) => {
            //console.log(e.stack ? String(e.stack).grey : String(e).grey)
          })
        }
        break;
      case "stop": {
        //Stop the player
        interaction.reply({content : `⏹ **Stopped playing and left the Channel**`, ephemeral: true})
        if (player) {
          await player.destroy();
          //edit the message so that it's right!
          var data = generateQueueEmbed(client, guild.id, true)
          message.edit(data).catch((e) => {
            //console.log(e.stack ? String(e.stack).grey : String(e).grey)
          })
        } else {
          //edit the message so that it's right!
          var data = generateQueueEmbed(client, guild.id, true)
          message.edit(data).catch((e) => {
            //console.log(e.stack ? String(e.stack).grey : String(e).grey)
          })
        }
      }
      break;
      case "pause": {
        if (!player.playing) {
          player.pause(false);
          interaction.reply({content : `▶️ **Resumed!**`, ephemeral: true})
        } else {
          //pause the player
          player.pause(true);

          interaction.reply({content: `⏸ **Paused!**`, ephemeral: true})
        }
        //edit the message so that it's right!
        var data = generateQueueEmbed(client, guild.id)
        message.edit(data).catch((e) => {
          //console.log(e.stack ? String(e.stack).grey : String(e).grey)
        })
      }
      break;
      case "save": {
        //pause the player
        player.set(`autoplay`, !player.get(`autoplay`))
        interaction.reply({content :`${player.get(`autoplay`) ? `<a:yes:833101995723194437> **Enabled Autoplay**`: `<:no:833101993668771842> **Disabled Autoplay**`}`, ephemeral: true})
        //edit the message so that it's right!
        var data = generateQueueEmbed(client, guild.id)
        message.edit(data).catch((e) => {
          //console.log(e.stack ? String(e.stack).grey : String(e).grey)
        })
      }
      break;
      case "vdown": {
        //set into the player instance an old Queue, before the shuffle...
        if (!player) {
          return collector.stop();
        }
       let amount = Number(player.volume) - 10;
        await player.setVolume(amount);
        interaction.reply({content : `🔉 The current volume is: **${amount}**`, ephemeral: true})
        //edit the message so that it's right!
        var data = generateQueueEmbed(client, guild.id)
        message.edit(data).catch((e) => {
          //console.log(e.stack ? String(e.stack).grey : String(e).grey)
        })
      }
      break;
      case "vup": {
        //if there is active queue loop, disable it + add embed information
        if (!player) {
          return collector.stop();
        }
        let amount = Number(player.volume) + 10;
     if(amount >= 150) return i.editReply({content : `Cannot higher the player volume further more.`, ephemeral: true});
        await player.setVolume(amount);
        interaction.reply({content: `🔊 The current volume is: **${amount}**`, ephemeral: true})
        //edit the message so that it's right!
        var data = generateQueueEmbed(client, guild.id)
        message.edit(data).catch((e) => {
          //console.log(e.stack ? String(e.stack).grey : String(e).grey)
        })
      }
      break;
      case "prev": {
        //if there is active queue loop, disable it + add embed information
        if (!player) {
          return collector.stop();
      }
      player.queue.add(player.queue.previous, 0);
      await player.stop()
        interaction.reply({content: `⏮️ Playing The Previous Song!`, ephemeral: true})
        //edit the message so that it's right!
        var data = generateQueueEmbed(client, guild.id)
        message.edit(data).catch((e) => {
          //console.log(e.stack ? String(e.stack).grey : String(e).grey)
        })
      }
      break;
      case "m10": {
        //get the seektime variable of the user input
        var seektime = player.position - 10 * 1000;
        if (seektime >= player.queue.current.duration - player.position || seektime < 0) {
          seektime = 0;
        }
        //seek to the new Seek position
        await player.seek(Number(seektime));
        //seek to the new Seek position
        
        interaction.reply({content: `⏪ **Rewinded the song for \`10 Seconds\`!**`, ephemeral: true})
        //edit the message so that it's right!
        var data = generateQueueEmbed(client, guild.id)
        message.edit(data).catch((e) => {
          //console.log(e.stack ? String(e.stack).grey : String(e).grey)
        })
      }
      break;
      case "p10": {
        var seektime = Number(player.position) + 10 * 1000;
        //if the userinput is smaller then 0, then set the seektime to just the player.position
        if (10 <= 0) seektime = Number(player.position);
        //if the seektime is too big, then set it 1 sec earlier
        if (Number(seektime) >= player.queue.current.duration) seektime = player.queue.current.duration - 1000;
        //seek to the new Seek position
        await player.seek(Number(seektime));
        interaction.reply({content: `⏩ **Forwarded the song for \`10 Seconds\`!**`, ephemeral: true})
        //edit the message so that it's right!
        var data = generateQueueEmbed(client, guild.id)
        message.edit(data).catch((e) => {
          //console.log(e.stack ? String(e.stack).grey : String(e).grey)
        })
      }
      break;
      case "loop": {

        if (player.queueRepeat) {
          player.setQueueRepeat(false);
        }
        //set track repeat to revers of old track repeat
        player.setTrackRepeat(!player.trackRepeat);
        interaction.reply({content:`${player.trackRepeat ? `<:right:927434790087577600> **Enabled Song Loop**`: `<:wrong:927437620882059304> **Disabled Song Loop**`}`, ephemeral: true})

      }
      break;
      }
    }
    

  })
  //this was step 1 now we need to code the REQUEST System...


  client.on("messageCreate", async message => {
    if (!message.guild) return;
    var data = client.musicsettings.get(message.guild.id);
    const musicChannelId = data.channel;
    //if not setupped yet, return
    if (!musicChannelId || musicChannelId.length < 5) return;
    //if not the right channel return
    if (musicChannelId != message.channel.id) return;
    //Delete the message once it got sent into the channel, bot messages after 5 seconds, user messages instantly!
    if (message.author.id === client.user.id) {
      await delay(5000);
      if (!message.deleted) {
        message.delete().catch((e) => {
          console.log(e)
        })
      }
    } else {
      if (!message.deleted) {
        message.delete().catch((e) => {
          console.log(e)
        })
      }
    }
    if (message.author.bot) return; // if the message  author is a bot, return aka ignore the inputs
    const prefix = client.settings.get(message.guild.id, "prefix")
    //get the prefix regex system
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`); //the prefix can be a Mention of the Bot / The defined Prefix of the Bot
    var args;
    var cmd;
    if (prefixRegex.test(message.content)) {
      //if there is a attached prefix try executing a cmd!
      const [, matchedPrefix] = message.content.match(prefixRegex); //now define the right prefix either ping or not ping
      args = message.content.slice(matchedPrefix.length).trim().split(/ +/); //create the arguments with sliceing of of the rightprefix length
      cmd = args.shift().toLowerCase(); //creating the cmd argument by shifting the args by 1
      if (cmd || cmd.length === 0) return // message.reply("<:no:833101993668771842> **Please use a Command Somewhere else!**").then(msg=>{setTimeout(()=>{try{msg.delete().catch(() => {});}catch(e){ }}, 3000)})

      var command = client.commands.get(cmd); //get the command from the collection
      if (!command) command = client.commands.get(client.aliases.get(cmd)); //if the command does not exist, try to get it by his alias
      if (command) //if the command is now valid
      {
        return // message.reply("<:no:833101993668771842> **Please use a Command Somewhere else!**").then(msg=>{setTimeout(()=>{try{msg.delete().catch(() => {});}catch(e){ }}, 3000)})
      }
    }
    //getting the Voice Channel Data of the Message Member
    const {
      channel
    } = message.member.voice;
    //if not in a Voice Channel return!
    if (!channel) return message.reply("<:no:833101993668771842> **Please join a Voice Channel first!**").then(msg => {
      setTimeout(() => {
        try {
          msg.delete().catch(() => {});
        } catch (e) {}
      }, 5000)
    })
    //get the lavalink erela.js player information
    const player = client.manager.players.get(message.guild.id);
    //if there is a player and the user is not in the same channel as the Bot return information message
    if (player && channel.id !== player.voiceChannel) return message.reply(`<:no:833101993668771842> **Please join __my__ Voice Channel first! <#${player.voiceChannel}>**`).then(msg => {
      setTimeout(() => {
        try {
          msg.delete().catch(() => {});
        } catch (e) {}
      }, 3000)
    })
    else {
      return playermanager(client, message, message.content.trim().split(/ +/), "request:song");
    }
  })


}



function generateQueueEmbed(client, guildId, leave) {
  const guild = client.guilds.cache.get(guildId)
  if (!guild) return;
  const es = client.settings.get(guild.id, "embed")
  const ls = client.settings.get(guild.id, "language")
  var embeds = [

    new MessageEmbed()
    .setColor(es.color)
    .setDescription(`Type Any Song Name To Play song`)
    .setFooter({text:`By Team Apera`}),
    
    new MessageEmbed()
    .setColor(es.color)
    
    .setImage(guild.banner ? guild.bannerURL({
      size: 4096
    }) : "https://media.discordapp.net/attachments/931893471667712071/933004403118604368/20220110_223609.jpg?width=1193&height=671")
    .setTitle(`**Nothing playing right now**`)
    .setDescription(`[Invite](https://discord.com/api/oauth2/authorize?client_id=908633471797301268&permissions=8&scope=bot%20applications.commands) ~ [Support Server](https://discord.gg/vfJRp2n3WW)`)
  ]
  const { convertTime } = require('../../utils/convert.js');
  const player = client.manager.players.get(guild.id);
  if (!leave && player && player.queue && player.queue.current) {
    embeds[1].setImage(`https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`)
      .setTimestamp()
     
      .setAuthor(client.getAuthor(`${player.queue.current.title}`, "https://images-ext-1.discordapp.net/external/DkPCBVBHBDJC8xHHCF2G7-rJXnTwj_qs78udThL8Cy0/%3Fv%3D1/https/cdn.discordapp.com/emojis/859459305152708630.gif", player.queue.current.uri))
      
    delete embeds[1].description;
    delete embeds[1].title;
    //get the right tracks of the current tracks
    const tracks = player.queue;
    var maxTracks = 10; //tracks / Queue Page
    //get an array of quelist where 10 tracks is one index in the array
    var songs = tracks.slice(0, maxTracks);
    embeds[0] = new MessageEmbed()
    
    .setColor(es.color)
    .setTitle(`**Queue Stats**`);
    embeds[0].addFields(
      { name: `  **Queued Track(s)**`, value: `\`[ ${player.queue.length} ]\``, inline: true },
      { name: `  **Track Loop**`, value: `\`[ ${player.trackRepeat ? `Enabled`: `Disabled`} ]\``, inline: true },
      { name: `  **Queue Loop**`, value: `\`[ ${player.queueRepeat ? `Enabled`: `Disabled`} ]\``, inline: true },
      { name: `  **Volume**`, value: `\`[ ${player.volume} % ]\``, inline: true },
      { name: `  **Autoplay**`, value: `\`[ ${player.get(`autoplay`) ? `Enabled`: `Disabled`} ]\``, inline: true },
      { name: `  **Duration**`, value: `\`[ ${convertTime(player.queue.current.duration)} ]\``, inline: true }
              )
  }
  
  //now we add the components!

    const But1 = new MessageButton().setCustomId("vdown").setEmoji("🔉").setStyle("SECONDARY");
    
    const But2 = new MessageButton().setCustomId("prev").setEmoji("⏮️").setStyle("SECONDARY");
 
    const But3 = new MessageButton().setCustomId("pause").setEmoji("⏸").setStyle("SECONDARY");
 
    const But4 = new MessageButton().setCustomId("skip").setEmoji("⏭️").setStyle("SECONDARY");
     
    const But5 = new MessageButton().setCustomId("vup").setEmoji("🔊").setStyle("SECONDARY");

    const But6 = new MessageButton().setCustomId("m10").setEmoji("⏪").setStyle("SECONDARY");
    
    const But7 = new MessageButton().setCustomId("save").setEmoji("♾️").setStyle("SECONDARY");
 
    const But8 = new MessageButton().setCustomId("stop").setEmoji("⏹").setStyle("SECONDARY");
 
    const But9 = new MessageButton().setCustomId("loop").setEmoji("🔁").setStyle("SECONDARY");
     
    const But10 = new MessageButton().setCustomId("p10").setEmoji("⏩").setStyle("SECONDARY");
 
  //now we add the components!
  var components = [
    
    new MessageActionRow().addComponents([
      But1, But2, But3, But4, But5
    ]),
    new MessageActionRow().addComponents([
      But6, But7, But8, But9, But10 ]),
  ]
  return {
    embeds,
    components
  }
}
module.exports.generateQueueEmbed = generateQueueEmbed;
