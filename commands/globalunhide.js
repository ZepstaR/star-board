const core = require('../coreFunctions.js')
var configuration = require('../config.json')
const Enmap = require('enmap');
module.exports = {
  controls: {
    permission: 1
  },
  do: (message, client, args, Discord) => {

    if (!client.messages.get(args[0])) return message.reply("Please specify the message ID of the message you are trying to unhide!")

    if (client.messages.get(args[0], 'hidden') === false) return message.reply("This message is not hidden!")
    client.messages.set(args[0], false, 'hidden')
    return message.reply("The specified message has been unhidden and will appear on the global starboard if starred!")

  }
}
