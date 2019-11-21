const ms = require('ms')
module.exports = {
  controls: {
    permission: 10
  },
  do: (message, client, args, Discord) => {
    message.reply("**Global Starboard**\nThe bot watches messages that have been posted any time after it has joined. Any message that gets 6 :star: reactions will automatically be posted to the Global Starboard. You can get the link to the Global Starboard server (so you can see the Global Starboard) by running the `*server` command.\n\nIf you would like to set up a server starboard for your server, you can do that easily! Just use `*setstarboard` to set the channel starred messages should be posted to. The default threshold is 3 (any message that gets 3 :star: reactions will be posted), and that can be changed with the `*setthreshold` command.\n**NOTE:** Currently you cannot reset your server starboard channel after setting it.\n\nPlease see `*help` for a full list of commands! If you need help, you can ask in the support channel of our official server (`*server` command).\n\nThis bot was developed by " + client.users.get("327887845270487041").tag + " (327887845270487041) for Discord Hack Week.")
  }
}
