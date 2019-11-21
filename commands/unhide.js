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

    if (!client.messages.get(args[0])) return message.reply("Please specify the message ID of the message you are trying to unhide!")
    if (client.channels.get(client.messages.get(args[0], 'channelid')).guild.id !== message.guild.id) return message.reply("You do not have permission to unhide this message!")

    if (client.messages.get(args[0], 'serverHidden') === false) return message.reply("This message is not hidden!")
    client.messages.set(args[0], false, 'serverHidden')
    return message.reply("The specified message has been unhidden and will appear on the server starboard if starred!")

  }
}
