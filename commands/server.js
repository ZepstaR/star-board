const ms = require('ms')
module.exports = {
  controls: {
    permission: 10
  },
  do: (message, client, args, Discord) => {
    message.reply("The official Global Starboard server can be found at https://discord.gg/nMjHtqX")
  }
}
