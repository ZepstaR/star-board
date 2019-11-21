const core = require('../coreFunctions.js')
const Enmap = require('enmap');
module.exports = {
  controls: {
    permission: 10
  },
  do: (message, client, args, Discord) => {
    if (!message.member.hasPermission('MANAGE_GUILD')) {
      return message.reply("You must have the **Manage Server** permission to use this command.")
    }

    if (!client.servers) {
      core.initEnmap("servers", client)
    }

    client.servers.ensure(`${message.guild.id}`, {
      guildid: message.guild.id
    });

    if (!client.servers.get(message.guild.id, 'starboard')) return message.reply("You must set up a starboard channel first! Use the `*setstarboard` command to do this.")
    if (!args[0]) return message.reply("Please specify a new star threshold! Your current threshold is **" + client.servers.get(message.guild.id, 'threshold') + "**.");
    var parsed = parseInt(args[0]);
    if (!parsed || parsed < 1) return message.reply("That is an invalid threshold. The threshold must be an integer that is at least 1.")
    else {
      client.servers.set(message.guild.id, parsed, 'threshold')
      return message.reply("The server starboard threshold for **" + message.guild.name + "** has been set to **" + parsed.toString() + "**!")

    }

  }
}
