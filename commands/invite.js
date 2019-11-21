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
    if (client.servers.get(client.channels.get(msg.channelid).guild.id, 'starboard')) {
      client.channels.get(client.servers.get(client.channels.get(msg.channelid).guild.id, 'starboard')).createInvite({
        maxAge: 0
      }, "Info command").then(invite => {
        var inv = invite.code
        var name = client.channels.get(msg.channelid).guild.name
        message.reply("Invite to **" + name + "**: https://discord.gg/" + inv)
      }).catch(e => {
        return message.reply("I cannot generate an invite to **" + client.channels.get(msg.channelid).guild.name + "**.")
      })
    } else {
      return message.reply("I cannot generate an invite to **" + client.channels.get(msg.channelid).guild.name + "**.")
    }
  }
}
