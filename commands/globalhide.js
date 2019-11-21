const core = require('../coreFunctions.js')
var configuration = require('../config.json')
const Enmap = require('enmap');
module.exports = {
  controls: {
    permission: 1
  },
  do: (message, client, args, Discord) => {

    if (!client.messages.get(args[0])) return message.reply("Please specify the message ID of the message you are trying to hide!")
    if (client.messages.get(args[0], 'channelid') === configuration.config.channels.global_starboard) return message.reply("This message is a starboard message and cannot be hidden.")

    if (client.messages.get(args[0], 'hidden') === true) return message.reply("This message has already been hidden!")

    if (client.messages.get(args[0], 'globalBoard') === false) {
      client.messages.set(args[0], true, 'hidden')
      return message.reply("The specified message has been hidden and will not appear on the global starboard if starred!")
    } else {
      client.channels.get(configuration.config.channels.global_starboard).fetchMessage(client.messages.get(args[0], 'globalBoardMessage')).then(fetched => {
        fetched.delete()
        return message.reply("The specified message has been removed from the global starboard and will not appear again if starred!")
      })
    }
  }
}
