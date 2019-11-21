const ms = require('ms')
const core = require('../coreFunctions.js')
module.exports = {
  controls: {
    permission: 10
  },
  do: (message, client, args, Discord) => {
    let embed = new Discord.RichEmbed()
    embed.setAuthor("Global Starboard Help", client.user.displayAvatarURL)
    embed.setDescription("The bot prefix is `*`\nPlease use the `*about` command to see more information about the features of the bot!")
    embed.addField("Starboard Commands", "`*info <message id>` - Shows info about a message\n`*server` - Generates an invite to a server a starboard message is from\n`*hide <message id>` - Hides a message from the server starboard\n`*unhide <message id>` - Unhides a message from the server starboard\n`*setstarboard <#channel mention>` - Sets the server starboard channel\n`*setthreshold <number>` - Sets the server starboard threshold")
    if (core.checkPermissions(message.author.id, client) <= 1) {
      embed.addField("Global Moderator Commands", "`*globalhide <message id>` - Hides a message from the global starboard\n`*globalunhide <message id>` - Unhides a message from the global starboard")
    }
    if (core.checkPermissions(message.author.id, client) <= 0) {
      embed.addField("Global Admin Commands", "`*config <settings>` - Configures bot status\n`*eval <code>` - Runs code\n`*reboot` - Reboots the bot")
    }
    embed.addField("Misc Commands", "`*server` - Generates an invite link to the official Global Starboard Server\n`*ping` - Checks bot response time\n`*help` - Displays this message\n`*about` - An explanation of the main features of the bot")
    embed.setColor("#7289da")
    message.channel.send(embed)
  }
}
