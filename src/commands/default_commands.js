var Commands = [];
var request = require('request');

Commands.game = {
  name: 'game',
  aliases: ['g'],
  help: '',
  func: function(message, query, bot) {
    if (message === query) {
      var guild = message.guild;
      if (guild) {
        var user = guild.members.find(member => {
          return member.user.username === query;
        });

        var gameName = user.user.game;
        if (gameName) {
          var gameInfo = bot.games.find(game => {
            return game.name === gameName.name;
          });
          if (gameInfo) {
            request('http://store.steampowered.com/api/appdetails?appids=' + gameInfo.appid + '&l=russian', (error, response, body) => {
              if (!error && response.statusCode === 200) {
                try {
                  JSON.parse(body);
                } catch (e) {
                  message.channel.sendMessage(bot.locale.steamError);
                  return;
                }
                var steamResponse = JSON.parse(body)[gameInfo.appid];
                if (steamResponse.success === true && steamResponse.data.type === 'game') {
                  var textMessage = bot.locale.steamGame
                      .replace(/\{name}/g, gameInfo.name)
                      .replace('{genres}', gameInfo.genres ? gameInfo.genres.map(elem => {
                        return elem.description;
                      }).join(', ') : '-')
                      .replace('{developers}', gameInfo.developers ? gameInfo.developers.join(', ') : '-')
                      .replace('{publishers}', gameInfo.publishers ? gameInfo.publishers.join(', ') : '-')
                      .replace('{release_date}', gameInfo.release_date.date)
                      .replace('{detailed_description}', gameInfo.detailed_description.replace(/<\/?[^>]+(>|$)/g, ''));
                  message.channel.sendFile(gameInfo.header_image.split('?')[0], '', textMessage);
                }
              }
            });
          } else {
            message.reply('к сожалению, игры "' + gameName + '", в которую играет ' + user.user.username + ' нет в базе данных Steam.', true);
          }
        }
      }
    } else {
      var textMessage = bot.locale.steamGame
          .replace('{name}', bot.game.name)
          .replace('{genres}', bot.game.genres ? bot.game.genres.map(elem => {
            return elem.description;
          }).join(', ') : '-')
          .replace('{developers}', bot.game.developers ? bot.game.developers.join(', ') : '-')
          .replace('{publishers}', bot.game.publishers ? bot.game.publishers.join(', ') : '-')
          .replace('{release_date}', bot.game.release_date.date)
          .replace('{detailed_description}', bot.game.detailed_description.replace(/<\/?[^>]+(>|$)/g, ''));
      message.channel.sendFile(bot.game.header_image.split('?')[0], '', textMessage);
    }
  }
};

Commands.emote = {
  name: 'emote',
  aliases: ['e'],
  help: '',
  func: function(message, query, bot) {
    var emoteContainer = bot.emotes.find(emote => {
      return query === emote.code.toLowerCase();
    });
    if (emoteContainer === undefined) {
      emoteContainer = bot.emotes.find(emote => {
        return emote.code.toLowerCase().indexOf(query) !== -1;
      });
    }
    if (emoteContainer === undefined) {
      message.reply(bot.locale.noEmote);
    } else {
      message.channel.sendFile('https://static-cdn.jtvnw.net/emoticons/v1/' + emoteContainer.image_id + '/3.0', emoteContainer.code + '.png');
    }
  }
};

exports.commands = Commands;
