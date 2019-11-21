module.exports = {
  controls: {
    permission: 0
  },
  do: (message, client, args, Discord) => {
    if (!args[0]) return message.channel.send("Use `config <game|status|username|nick|avatar> <setting>`")
    else switch (args[0]) {
      case "game":
        if (!args[1]) {
          return message.channel.send("Use `config <game|status|username|nick|avatar> <setting>`")
        } else {
          switch (args[1].toLowerCase()) {
            case "playing":
              var status = "PLAYING"
              var playing = args.splice(2).join(" ")
              break;
            case "listening":
              var status = "LISTENING"
              var playing = args.splice(2).join(" ")
              break;
            case "watching":
              var status = "WATCHING"
              var playing = args.splice(2).join(" ")
              break;
            default:
              var status = "PLAYING";
              var playing = args.splice(1).join(" ")
          }
        }
        client.user.setActivity(playing, {
          type: status
        })
        break;
      case "status":
        if (!args[1]) {
          return message.channel.send("Use `config <game|status|username|nick|avatar> <setting>`")
        } else {
          switch (args[1]) {
            case "online":
              client.user.setStatus("online");
              return message.react("👌")
              break;
            case "idle":
              client.user.setStatus("idle");
              return message.react("👌")
              break;
            case "dnd":
              client.user.setStatus("dnd");
              return message.react("👌")
              break;
            case "invisible":
              client.user.setStatus("invisible");
              return message.react("👌")
              break;
            default:
              return message.channel.send("Use `config status <online|idle|dnd|invisible>`")
          }
        }
        break;
      case "username":
        if (!args[0]) {
          return message.channel.send("Use `config username <new username>`")
        } else {
          var newusername = args.splice(1).join(" ");
          client.user.setUsername(newusername)
          return message.react("👌")
        }

        break;
      case "nick":
        if (!args[0]) {
          return message.channel.send("Use `config nick <new nick>`")
        } else {
          var newnick = args.splice(1).join(" ");
          message.guild.me.setNickname(newnick)
          return message.react("👌")
        }
        break;
      case "avatar":
        if (!args[0]) {
          return message.channel.send("Use `config avatar <link>`")
        } else {
          client.user.setAvatar(args[1])
          return message.react("👌")
        }
        break;

    }
  }
}
