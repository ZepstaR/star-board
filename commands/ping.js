const ms = require('ms')
module.exports = {
  controls: {
    permission: 10
  },
  do: (message, client, args, Discord) => {
    message.reply(":ping_pong: Pong! :ping_pong:\n**Current Client Ping:** " + client.ping + "ms").then(sent => {
      sent.edit(sent.content + "\n**Edit Time:** " + ms(new Date().getTime() - sent.createdTimestamp))
    })
  }
}
