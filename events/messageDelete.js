const core = require("../coreFunctions.js");
const fs = require('fs');
const Enmap = require('enmap');
const request = require('request');
const configuration = require('../config.json');
module.exports = (client, Discord, message) => {
  if (!client.servers) {
    core.initEnmap("servers", client)
  }
  if (message.channel.id === configuration.config.channels.global_starboard) {
    var foundMsg = client.messages.find(msg => msg.globalBoardMessage == message.id)
    if (!foundMsg) return;
    client.messages.set(foundMsg.messageid, false, 'globalBoard')
    client.messages.set(foundMsg.messageid, true, 'hidden')
    client.messages.delete(foundMsg.messageid, 'globalBoardMessage')
  } else if (client.servers.get(message.guild.id, 'starboard') && message.channel.id === client.servers.get(message.guild.id, 'starboard')) {
    var foundMsg = client.messages.find(msg => msg.serverBoardMessage == message.id)
    if (!foundMsg) return;
    client.messages.set(foundMsg.messageid, false, 'serverBoard')
    client.messages.set(foundMsg.messageid, true, 'serverHidden')
    client.messages.delete(foundMsg.messageid, 'serverBoardMessage')
  }
  client.messages.delete(message.id)

}
