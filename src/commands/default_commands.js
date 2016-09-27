var Commands = [];
var request = require('request');

// TODO move textmessage to localization
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
                  message.channel.sendMessage('The Steam API returned a bad response.');
                  return;
                }
                var steamResponse = JSON.parse(body)[gameInfo.appid];
                if (steamResponse.success === true && steamResponse.data.type === 'game') {
                  var textMessage = 'Я сейчас играю в **' + gameInfo.name +
                      '**\n```Markdown\nНазвание: ' + gameInfo.name +
                      (bot.game.genres ? '\nЖанр: ' + gameInfo.genres.map(elem => {
                        return elem.description;
                      }).join(', ') : '') +
                      (bot.game.developers ? '\nРазработчик: ' + gameInfo.developers.join(', ') : '') +
                      (bot.game.publishers ? '\nИздатель: ' + gameInfo.publishers.join(', ') : '') +
                      '\nДата выхода: ' + gameInfo.release_date.date +
                      '\n\n---\n' + gameInfo.detailed_description.replace(/<\/?[^>]+(>|$)/g, '') + '```';
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
      var textMessage = 'Я сейчас играю в **' + bot.game.name +
          '**\n```Markdown\nНазвание: ' + bot.game.name +
          (bot.game.genres ? '\nЖанр: ' + bot.game.genres.map(elem => {
            return elem.description;
          }).join(', ') : '') +
          '\nРазработчик: ' + bot.game.developers.join(', ') +
          '\nИздатель: ' + bot.game.publishers.join(', ') +
          '\nДата выхода: ' + bot.game.release_date.date +
          '\n\n---\n' + bot.game.detailed_description.replace(/<\/?[^>]+(>|$)/g, '') + '```';
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
      message.reply("There is no such emote in database");
    } else {
      message.channel.sendFile('https://static-cdn.jtvnw.net/emoticons/v1/' + emoteContainer.image_id + '/3.0', emoteContainer.code + '.png');
    }
  }
};

exports.commands = Commands;
