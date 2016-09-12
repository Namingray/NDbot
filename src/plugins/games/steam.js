'use strict';
var rfr = require('rfr');
var Utils = rfr('/src/utils.js');
var request = require('request');

/** Steam class */
class Steam {

  /** Start playing */
  _startPlaying() {
    setInterval(() => {
      var idx = Utils.getRandomInt(0, this._games.length - 1);
      console.log('Was chosen ' + this._games[idx].name);
      this._bot.ndBot.user.setStatus('online', this._games[idx].name);
    }, 600000);
  }

  /** Create Steam class
   *
   * @param {string} steamAPIkey - Google API key
   * @param {NDbot} bot - Bot object
   */
  constructor(steamAPIkey, bot) {
    this._key = steamAPIkey;
    this._bot = bot;
    try {
      request('http://api.steampowered.com/ISteamApps/GetAppList/v0001/', (error, response, body) => {
        var result = JSON.parse(body);
        this._games = result.applist.apps.app;
        this._startPlaying();
      });
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Steam;
