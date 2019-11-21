module.exports = {
  //checkPermissions: Returns permission level of inputted ID
  checkPermissions: function(id, client) {
    const configuration = require('./config.json');
    if (configuration.config.admins.includes(id)) return 0;
    else if (client.guilds.get(configuration.config.main_server).available && client.guilds.get(configuration.config.main_server).roles.get(configuration.config.roles.global_mod).members.get(id)) return 1;
    else return 10;
  },
  botLog: function(input) {
    const Discord = require('discord.js');
    const configuration = require('./config.json');
    var webhook = new Discord.WebhookClient(configuration.config.logs.bot.webhook.id, configuration.config.logs.bot.webhook.token);
    webhook.send(input);
  },
  load: function() {
    const configuration = require('./config.json');
    const Discord = require('discord.js');
    const fs = require('fs');
  },
  initEnmap: function(part, client) {
    const Enmap = require('enmap');
    switch (part) {
      case "messages":
        client.messages = new Enmap({
          name: "messages"
        });
        break;
      case "strikes":
        client.strikes = new Enmap({
          name: "strikes"
        });
        break;
      case "servers":
        client.servers = new Enmap({
          name: "servers"
        });
        break;
    }
  }
}
