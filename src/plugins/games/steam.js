'use strict';
var rfr = require('rfr');
var Utils = rfr('/src/utils.js');
var request = require('request');

/** Steam class */
class Steam {

  /** Choose random game */
  _chooseRandomGame() {
    var idx = Utils.getRandomInt(0, this._games.length - 1);
    this._bot.setStatus(this._games[idx].name);
    this._game = {
      id: idx,
      name: this._games[idx].name
    };
  }

  /** Start playing */
  _startPlaying() {
    setTimeout(() => {
      this._bot.setStatus(this._game.name);
    }, 5000);
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
    this._game = {
      id: '2200',
      name: 'Quake III Arena'
    };
    this._games = [];

    request('http://api.steampowered.com/ISteamApps/GetAppList/v0001/', (error, response, body) => {
      var result = JSON.parse(body);
      this._games = result.applist.apps.app;
      this._startPlaying();
    });
  }

  /** Get info about current game
   *
   * @param {Message} message - Message object
   */
  getCurrentGameInfo(message) {
    request('http://store.steampowered.com/api/appdetails?appids=' + this._game.id, (error, response, body) => {
      var result = JSON.parse(body)[this._game.id]['data'];
      var textMessage = 'Я сейчас играю в: ' + result.name + '\n```' + result.detailed_description.replace(/<\/?[^>]+(>|$)/g, '') + '```\n' + result.header_image.split('?')[0];
      this._bot.sendText(message, textMessage, false);
    });
  }
}

module.exports = Steam;
