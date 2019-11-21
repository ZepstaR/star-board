const ms = require('ms')
var core = require('../coreFunctions.js')
var configuration = require('../config.json')
module.exports = {
  controls: {
    permission: 10
  },
  do: (message, client, args, Discord) => {
    if (!client.servers) {
      core.initEnmap("servers", client)
    }
    if (!client.messages.get(args[0])) return message.reply("Please specify a valid message ID!")
    var msg = client.messages.get(args[0])
    client.channels.get(msg.channelid).fetchMessage(msg.messageid).then(fetched => {


      let embed = new Discord.RichEmbed()
      embed.setTitle("Star Info: " + args[0])
      embed.addField("Stars", ":star: " + msg.stars)

      embed.addField("Posted by", fetched.author.tag + " (" + fetched.author.id + ")")
      embed.setThumbnail(fetched.author.displayAvatarURL)

      if (client.channels.get(msg.channelid).guild.id === message.guild.id) {
        if (msg.serverBoard) {
          embed.addField("Server Starboard", "[Jump to starboard post](https://discordapp.com/channels/" + message.guild.id + "/" + client.servers.get(message.guild.id, 'starboard') + "/" + msg.serverBoardMessage + ")")
        } else embed.addField("Server Starboard", "This post is not on the server starboard")
      } else {
        embed.addField("From Server", client.channels.get(msg.channelid).guild.name + " (" + client.channels.get(msg.channelid).guild.id + ")\nUse `*invite " + args[0] + "` to get an invite to this server")
      }

      if (msg.globalBoard === true) {
        embed.addField("Global Starboard", "This post is on the global starboard! Join the [Global Starboard server](https://discord.gg/nMjHtqX) and [jump to the starboard post](https://discordapp.com/channels/" + configuration.config.main_server + "/" + configuration.config.channels.global_starboard + "/" + msg.globalBoardMessage + ")")
      } else embed.addField("Global Starboard", "This post is not on the global starboard")
      embed.setColor("#FFAD00")
      message.channel.send(embed)
    })
  }
}
