'use strict';
var rfr = require('rfr');
var Utils = rfr('/src/utils.js');
var request = require('request');

/** Steam class */
class Steam {

  /** Choose random game */
  _chooseRandomGame() {
    var idx;
    try {
      idx = Utils.getRandomInt(0, this._games.length - 1);
      request('http://store.steampowered.com/api/appdetails?appids=' + this._games[idx].appid + '&l=russian', (error, response, body) => {
        var result = JSON.parse(body)[this._games[idx].appid];
        if (result.success === true && result.data.type === 'game') {
          this._bot.setStatus(this._games[idx].name);
          this._game = result.data;
        } else {
          this._chooseRandomGame();
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  /** Start playing */
  _startPlaying() {
    setTimeout(() => {
      this._chooseRandomGame();
    }, 1000);
    setInterval(() => {
      this._chooseRandomGame();
    }, 600000);
  }

  /** Create Steam class
   *
   * @param {NDbot} bot - Bot object
   * @param {string} steamAPIkey - Google API key
   */
  constructor(bot, steamAPIkey) {
    this._key = steamAPIkey;
    this._bot = bot;
    this._game = null;
    this._games = [];

    request('http://api.steampowered.com/ISteamApps/GetAppList/v0002/', (error, response, body) => {
      var result = JSON.parse(body);
      this._games = result.applist.apps;
      this._startPlaying();
    });
  }

  /** Send game info to the channel
   *
   * @param {Message} message - Message object
   * @param {Object} game - Game info object
   * @param {String} textInitial - Initial text for message
   */
  _sendGameInfo(message, game, textInitial) {
    var textMessage = textInitial + '**' + game.name +
        '**\n```Markdown\nНазвание: ' + game.name +
        (game.genres ? '\nЖанр: ' + game.genres.map(elem => {
          return elem.description;
        }).join(', ') : '') +
        '\nРазработчик: ' + game.developers.join(', ') +
        '\nИздатель: ' + game.publishers.join(', ') +
        '\nДата выхода: ' + game.release_date.date +
        '\n\n---\n' + game.detailed_description.replace(/<\/?[^>]+(>|$)/g, '') + '```';
    this._bot.sendImage(message, game.header_image.split('?')[0], textMessage, false);
  }

  /** Get info about current bot game
   *
   * @param {Message} message - Message object
   */
  getCurrentGameInfo(message) {
    if (this._game) {
      this._sendGameInfo(message, this._game, 'Я сейчас играю в ');
    }
  }

  /** Get info about current user game
   *
   * @param {Message} message - Message object
   * @param {User} user - User object
   */
  getUserGameInfo(message, user) {
    var gameName = user.game;
    if (gameName) {
      var gameInfo = this._games.find(game => {
        return game.name === gameName.name;
      });
      if (gameInfo) {
        request('http://store.steampowered.com/api/appdetails?appids=' + gameInfo.appid + '&l=russian', (error, response, body) => {
          var result = JSON.parse(body)[gameInfo.appid];
          if (result.success === true && result.data.type === 'game') {
            this._sendGameInfo(message, result.data, user.username + ' сейчас играет в ');
          }
        });
      } else {
        this._bot.sendText(message, 'к сожалению, игры, в которую играет ' + user.username + ' нет в базе данных Steam. Скорее всего это богомерзкий World of Warcraft', true);
      }
    }
  }
}

module.exports = Steam;
