const core = require('../coreFunctions.js')
module.exports = {
  controls: {
    permission: 0
  },
  do: (message, client, args, Discord) => {
    message.react("👌")
    client.user.setStatus('idle')
    core.botLog('`[REBOOT]` Force rebooted by ' + message.author.tag)
    setTimeout(function() {
      process.exit()
    }, 5000)
  }
}
