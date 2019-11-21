const core = require("../coreFunctions.js");
const fs = require('fs');
const Enmap = require('enmap');
const request = require('request');
const configuration = require('../config.json');
module.exports = (client, Discord, message) => {
  //Save as known to bot
  if (!client.messages) {
    core.initEnmap("messages", client)
  }
  if (message.channel.type !== "text") return;

  client.messages.ensure(`${message.id}`, {
    messageid: message.id,
    channelid: message.channel.id,
    stars: 0,
    starsInfo: {
      global: [],
      server: [],
      message: []
    },
    reported: false,
    hidden: false,
    serverBoard: false,
    globalBoard: false
  });


  //Check if message is a command
  fs.readdir("./commands/", (err, files) => {
    files.forEach(file => {
      const commandName = file.split(".")[0]; //Command to check against
      const command = require("../commands/" + commandName); //Command file
      if (message.channel.type !== "text" || message.author.bot === true) return; //Ignore DMs and bots

      let commandText = message.content.split(" ")[0].toLowerCase() //Input command
      if (commandText === configuration.config.prefix + commandName) { //Check if command matches
        let args = message.content.split(" ").splice(1);
        var permission = core.checkPermissions(message.author.id, client);

        if (permission > command.controls.permission) return message.react("🚫");
        if (command.controls.enabled === false) return message.reply("This command has been disabled globally.");
        return command.do(message, client, args, Discord);

      }
    });
  })
};
