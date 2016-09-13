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
    }, 20000);
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

  /** Get info about current game
   *
   * @param {Message} message - Message object
   */
  getCurrentGameInfo(message) {
    if (this._game) {
      try {
        var textMessage = 'Я сейчас играю в: **' + this._game.name +
            '**\n```Markdown\nНазвание: ' + this._game.name +
            '\nЖанр: ' + this._game.genres.map(elem => {
              return elem.description;
            }).join(', ') +
            '\nРазработчик: ' + this._game.developers.join(', ') +
            '\nИздатель: ' + this._game.publishers.join(', ') +
            '\nДата выхода: ' + this._game.release_date.date +
            '\n\n---\n' + this._game.detailed_description.replace(/<\/?[^>]+(>|$)/g, '') + '```';
        console.log(textMessage);
        this._bot.sendImage(message, this._game.header_image.split('?')[0], textMessage, false);
      } catch (e) {
        console.log(e);
      }
    }
  }
}

module.exports = Steam;
