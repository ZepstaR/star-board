const core = require('../coreFunctions.js')
const Enmap = require('enmap');
module.exports = {
  controls: {
    permission: 10
  },
  do: (message, client, args, Discord) => {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) {
      return message.reply("You must have the **Manage Messages** permission to use this command.")
    }

    if (!client.servers) {
      core.initEnmap("servers", client)
    }

    client.servers.ensure(`${message.guild.id}`, {
      guildid: message.guild.id
    });

    if (!client.messages.get(args[0])) return message.reply("Please specify the message ID of the message you are trying to hide!")
    if (client.channels.get(client.messages.get(args[0], 'channelid')).guild.id !== message.guild.id) return message.reply("You do not have permission to hide this message!")
    if (client.messages.get(args[0], 'channelid') === client.servers.get(message.guild.id, 'starboard')) return message.reply("This message is a starboard message and cannot be hidden.")

    if (client.messages.get(args[0], 'serverHidden') === true) return message.reply("This message has already been hidden!")

    if (client.messages.get(args[0], 'serverBoard') === false) {
      client.messages.set(args[0], true, 'serverHidden')
      return message.reply("The specified message has been hidden and will not appear on the server starboard if starred!")
    } else {
      client.channels.get(client.servers.get(message.guild.id, 'starboard')).fetchMessage(client.messages.get(args[0], 'serverBoardMessage')).then(fetched => {
        fetched.delete()
        return message.reply("The specified message has been removed from the server starboard and will not appear again if starred!")
      })
    }
  }
}
