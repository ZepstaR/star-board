const configuration = require('../config.json');
const core = require('../coreFunctions.js')
module.exports = (client, Discord, messageReaction, user) => {
  if (!client.messages) {
    core.initEnmap("messages", client)
  }
  if (!client.servers) {
    core.initEnmap("servers", client)
  }
  if (messageReaction.emoji.name === "⭐") {
    if (messageReaction.message.channel.type !== "text" || messageReaction.message.channel.nsfw === true) return;
    //Star reaction
    //Check if it's in the global starboard
    if (messageReaction.message.channel.id === configuration.config.channels.global_starboard) {
      if (user.id === client.user.id) return; //ignore self
      var foundMsg = client.messages.find(msg => msg.globalBoardMessage == messageReaction.message.id).messageid
      if (!foundMsg) return;
      client.channels.get(client.messages.get(foundMsg, "channelid")).fetchMessage(client.messages.get(foundMsg, "messageid")).then(fetched => {
        if (fetched.author.id === user.id) return;
        var reactedOnMessage = client.messages.get(foundMsg, "starsInfo.message")
        var reactedOnGlobal = client.messages.get(foundMsg, "starsInfo.global")
        var reactedOnServer = client.messages.get(foundMsg, "starsInfo.server")
        reactedOnGlobal.splice(reactedOnGlobal.findIndex(id => id == user.id), 1)
        var allReactions = reactedOnMessage.concat(reactedOnGlobal, reactedOnServer)
        var reactionsNoDupe = Array.from(new Set(allReactions));
        var starCount = reactionsNoDupe.length;
        client.messages.set(foundMsg, starCount, "stars");
        client.messages.set(foundMsg, reactedOnGlobal, "starsInfo.global");

        if (starCount < configuration.config.global_threshold && client.messages.get(foundMsg, "globalBoardMessage")) {
          client.channels.get(configuration.config.channels.global_starboard).fetchMessage(client.messages.get(foundMsg, "globalBoardMessage")).then(fetched => {
            fetched.delete()
            client.messages.set(foundMsg, false, "globalBoard")
            client.messages.delete(foundMsg, "globalBoardMessage")
          })
        }
        if (starCount >= configuration.config.global_threshold) { //Will be 6 later
          let embed = new Discord.RichEmbed()
          embed.setTitle(fetched.author.tag + " in " + fetched.guild.name)
          embed.setThumbnail(fetched.author.displayAvatarURL)
          embed.setColor("#FFAD00")
          embed.setTimestamp(fetched.createTimestamp)
          embed.setDescription(fetched.content)
          embed.setFooter("Message ID: " + fetched.id)
          if (fetched.attachments.first()) {
            embed.setImage(fetched.attachments.first().url)
          }
          client.channels.get(configuration.config.channels.global_starboard).fetchMessage(client.messages.get(fetched.id, "globalBoardMessage")).then(fetched_gs => {
            fetched_gs.edit(":star: **" + starCount.toString() + "** | <#" + fetched.channel.id + ">", embed)
          }).catch(e => {
            core.botLog("`[ERROR]` Failed to fetch message on Global Starboard")
          })
        }
        if (client.servers.get(client.channels.get(client.messages.get(foundMsg, 'channelid')).guild.id, 'starboard') && starCount < client.servers.get(client.channels.get(client.messages.get(foundMsg, 'channelid')).guild.id, 'threshold')) {
          console.log(client.servers.get(client.channels.get(client.messages.get(foundMsg, 'channelid')).guild.id, 'starboard') + " " + client.messages.get(foundMsg, "serverBoardMessage"))
          client.channels.get(client.servers.get(client.channels.get(client.messages.get(foundMsg, 'channelid')).guild.id, 'starboard')).fetchMessage(client.messages.get(foundMsg, "serverBoardMessage")).then(fetched => {
            fetched.delete()
            client.messages.set(foundMsg, false, "serverBoard")
            client.messages.delete(foundMsg, "serverBoardMessage")
          })
        }
        if (client.messages.get(foundMsg, 'serverBoard') === true) {
          let embed = new Discord.RichEmbed()
          embed.setTitle(fetched.author.tag)
          embed.setThumbnail(fetched.author.displayAvatarURL)
          embed.setColor("#FFAD00")
          embed.setTimestamp(fetched.createdTimestamp)
          embed.setDescription(fetched.content)
          embed.setFooter("Message ID: " + fetched.id)
          embed.addField("Jump to Message", "[Jump to message](https://discordapp.com/channels/" + fetched.guild.id + "/" + fetched.channel.id + "/" + fetched.id + ")")
          if (fetched.attachments.first()) {
            embed.setImage(fetched.attachments.first().url)
          }
          client.channels.get(client.servers.get(messageReaction.message.guild.id, 'starboard')).fetchMessage(client.messages.get(fetched.id, "serverBoardMessage")).then(fetched2 => {
            fetched2.edit(":star: **" + starCount.toString() + "** | <#" + fetched.channel.id + ">", embed)
          }).catch(e => {
            core.botLog("`[ERROR]` Failed to fetch message on server Starboard")
          })
        }

      })



    } else if (client.servers.get(messageReaction.message.guild.id) && messageReaction.message.channel.id === client.servers.get(messageReaction.message.guild.id, 'starboard')) {
      //Server starboard
      if (user.id === client.user.id) return; //ignore self
      var foundMsg = client.messages.find(msg => msg.serverBoardMessage == messageReaction.message.id).messageid
      if (!foundMsg) return;
      client.channels.get(client.messages.get(foundMsg, "channelid")).fetchMessage(client.messages.get(foundMsg, "messageid")).then(fetched => {
        if (fetched.author.id === user.id) return;

        var reactedOnMessage = client.messages.get(foundMsg, "starsInfo.message")
        var reactedOnGlobal = client.messages.get(foundMsg, "starsInfo.global")
        var reactedOnServer = client.messages.get(foundMsg, "starsInfo.server")
        reactedOnServer.splice(reactedOnServer.findIndex(id => id == user.id), 1)
        var allReactions = reactedOnMessage.concat(reactedOnGlobal, reactedOnServer)
        var reactionsNoDupe = Array.from(new Set(allReactions));
        var starCount = reactionsNoDupe.length;
        client.messages.set(foundMsg, starCount, "stars");
        client.messages.set(foundMsg, reactedOnServer, "starsInfo.server");

        if (starCount < client.servers.get(client.channels.get(client.messages.get(foundMsg, 'channelid')).guild.id).threshold) {
          client.channels.get(client.servers.get(client.channels.get(client.messages.get(foundMsg, 'channelid')).guild.id, 'starboard')).fetchMessage(client.messages.get(foundMsg, "serverBoardMessage")).then(fetched => {
            fetched.delete()
            client.messages.set(foundMsg, false, "serverBoard")
            client.messages.delete(foundMsg, "serverBoardMessage")
          })
        }
        if (starCount >= client.servers.get(client.channels.get(client.messages.get(foundMsg, 'channelid')).guild.id).threshold) {
          let embed = new Discord.RichEmbed()
          embed.setTitle(fetched.author.tag)
          embed.setThumbnail(fetched.author.displayAvatarURL)
          embed.setColor("#FFAD00")
          embed.setTimestamp(fetched.createdTimestamp)
          embed.setDescription(fetched.content)
          embed.setFooter("Message ID: " + fetched.id)
          embed.addField("Jump to Message", "[Jump to message](https://discordapp.com/channels/" + fetched.guild.id + "/" + fetched.channel.id + "/" + fetched.id + ")")
          if (fetched.attachments.first()) {
            embed.setImage(fetched.attachments.first().url)
          }
          client.channels.get(client.servers.get(client.channels.get(client.messages.get(foundMsg, 'channelid')).guild.id).starboard).fetchMessage(client.messages.get(fetched.id, "serverBoardMessage")).then(fetched_ss => {
            fetched_ss.edit(":star: **" + starCount.toString() + "** | <#" + fetched.channel.id + ">", embed)
          }).catch(e => {
            core.botLog("`[ERROR]` Failed to fetch message on Server Starboard")
          })
        }


        if (client.messages.get(foundMsg, "globalBoard") === true) {
          if (starCount < configuration.config.global_threshold && client.messages.get(foundMsg, "globalBoardMessage")) {
            client.channels.get(configuration.config.channels.global_starboard).fetchMessage(client.messages.get(foundMsg, "globalBoardMessage")).then(fetched => {
              fetched.delete()
              client.messages.set(foundMsg, false, "globalBoard")
              client.messages.delete(foundMsg, "globalBoardMessage")
            })
          } else {
            let embed = new Discord.RichEmbed()
            embed.setTitle(fetched.author.tag + " in " + fetched.guild.name)
            embed.setThumbnail(fetched.author.displayAvatarURL)
            embed.setColor("#FFAD00")
            embed.setTimestamp(fetched.createdTimestamp)
            embed.setDescription(fetched.content)
            embed.setFooter("Message ID: " + fetched.id)
            if (fetched.attachments.first()) {
              embed.setImage(fetched.attachments.first().url)
            }
            client.channels.get(configuration.config.channels.global_starboard).fetchMessage(client.messages.get(fetched.id, "globalBoardMessage")).then(fetchedgs => {
              fetchedgs.edit(":star: **" + starCount.toString() + "** | <#" + fetched.channel.id + ">", embed)
            }).catch(e => {
              core.botLog("`[ERROR]` Failed to fetch message on Global Starboard")
            })
          }
        }
      })
    } else {
      //Not on a starboard

      if (user.id === messageReaction.message.author.id)
        var reactedOnMessage = client.messages.get(messageReaction.message.id, "starsInfo.message")
      var reactedOnGlobal = client.messages.get(messageReaction.message.id, "starsInfo.global")
      var reactedOnServer = client.messages.get(messageReaction.message.id, "starsInfo.server")
      reactedOnMessage.splice(reactedOnMessage.findIndex(id => id == user.id), 1)
      var allReactions = reactedOnMessage.concat(reactedOnGlobal, reactedOnServer)
      var reactionsNoDupe = Array.from(new Set(allReactions));
      var starCount = reactionsNoDupe.length;
      client.messages.set(messageReaction.message.id, starCount, "stars");
      client.messages.set(messageReaction.message.id, reactedOnMessage, "starsInfo.message");
      if (client.messages.get(messageReaction.message.id, "serverBoard") === true && starCount < client.servers.get(messageReaction.message.guild.id, 'threshold')) {
        client.channels.get(client.servers.get(messageReaction.message.guild.id, 'starboard')).fetchMessage(client.messages.get(messageReaction.message.id, 'serverBoardMessage')).then(fetched => {
          fetched.delete()
          client.messages.set(messageReaction.message.id, false, "serverBoard")
          client.messages.delete(messageReaction.message.id, "serverBoardMessage")
        })
      }
      if (client.servers.get(messageReaction.message.guild.id) && client.servers.get(messageReaction.message.guild.id, 'threshold') && starCount >= client.servers.get(messageReaction.message.guild.id, 'threshold') && !client.messages.get(messageReaction.message.id, 'serverHidden')) {

        let embed = new Discord.RichEmbed()
        embed.setTitle(messageReaction.message.author.tag)
        embed.setThumbnail(messageReaction.message.author.displayAvatarURL)
        embed.setColor("#FFAD00")
        embed.setTimestamp(messageReaction.message.createdTimestamp)
        embed.setDescription(messageReaction.message.content)
        embed.setFooter("Message ID: " + messageReaction.message.id)
        embed.addField("Jump to Message", "[Jump to message](https://discordapp.com/channels/" + messageReaction.message.guild.id + "/" + messageReaction.message.channel.id + "/" + messageReaction.message.id + ")")
        if (messageReaction.message.attachments.first()) {
          embed.setImage(messageReaction.message.attachments.first().url)
        }
        client.channels.get(client.servers.get(messageReaction.message.guild.id, 'starboard')).fetchMessage(client.messages.get(messageReaction.message.id, "serverBoardMessage")).then(fetched => {
          fetched.edit(":star: **" + starCount.toString() + "** | <#" + messageReaction.message.channel.id + ">", embed)
        }).catch(e => {
          core.botLog("`[ERROR]` Failed to fetch message on server Starboard")
        })
      }
      if (starCount < configuration.config.global_threshold && client.messages.get(messageReaction.message.id, 'globalBoard')) {
        client.channels.get(configuration.config.channels.global_starboard).fetchMessage(client.messages.get(messageReaction.message.id, "globalBoardMessage")).then(fetched => {
          fetched.delete()
          client.messages.set(messageReaction.message.id, false, "globalBoard")
          client.messages.delete(messageReaction.message.id, "globalBoardMessage")
        })
      }
      if (starCount >= configuration.config.global_threshold) {
        if (!client.messages.get(messageReaction.message.id, "globalBoardMessage") && !client.messages.get(messageReaction.message.id, 'hidden')) {
          client.messages.set(messageReaction.message.id, true, "globalBoard");

          let embed = new Discord.RichEmbed()
          embed.setTitle(messageReaction.message.author.tag + " in " + messageReaction.message.guild.name)
          embed.setThumbnail(messageReaction.message.author.displayAvatarURL)
          embed.setColor("#FFAD00")
          embed.setTimestamp(messageReaction.message.createdTimestamp)
          embed.setDescription(messageReaction.message.content)
          embed.setFooter("Message ID: " + messageReaction.message.id)
          if (messageReaction.message.attachments.first()) {
            embed.setImage(messageReaction.message.attachments.first().url)
          }
          client.channels.get(configuration.config.channels.global_starboard).send(":star: **" + starCount.toString() + "** | <#" + messageReaction.message.channel.id + ">", embed).then(sent => {
            client.messages.set(messageReaction.message.id, sent.id, "globalBoardMessage");
            sent.react("⭐")
          }).catch(e => {
            core.botLog("`[ERROR]` Failed to post message to Global Starboard")
          })
        } else if (!client.messages.get(messageReaction.message.id, 'hidden')) {
          let embed = new Discord.RichEmbed()
          embed.setTitle(messageReaction.message.author.tag + " in " + messageReaction.message.guild.name)
          embed.setThumbnail(messageReaction.message.author.displayAvatarURL)
          embed.setColor("#FFAD00")
          embed.setTimestamp(messageReaction.message.createdTimestamp)
          embed.setDescription(messageReaction.message.content)
          embed.setFooter("Message ID: " + messageReaction.message.id)
          if (messageReaction.message.attachments.first()) {
            embed.setImage(messageReaction.message.attachments.first().url)
          }
          client.channels.get(configuration.config.channels.global_starboard).fetchMessage(client.messages.get(messageReaction.message.id, "globalBoardMessage")).then(fetched => {
            fetched.edit(":star: **" + starCount.toString() + "** | <#" + messageReaction.message.channel.id + ">", embed)
          }).catch(e => {
            core.botLog("`[ERROR]` Failed to fetch message on Global Starboard")
          })
        }
      }
    }
  }
}
