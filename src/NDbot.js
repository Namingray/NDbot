'use strict';

var Discord = require('discord.js');
var ImgSearch = require('./plugins/google/imgSearch.js');
var YouTube = require('./plugins/google/youtube.js');
var Steam = require('./plugins/games/steam.js');
var Utils = require('./utils.js');

/** Class representing a discord bot */
class NDbot {

  /** Create a bot
   *
   * @param {string} config - Configuration object
   */
  constructor(config) {
    this.ndBot = new Discord.Client();
    this._imgSearch = new ImgSearch(config.googleSEId, config.googleAPIKey);
    this._yt = new YouTube(config.googleAPIKey);
    this._steam = new Steam(config.steamAPIKey, this);
    this._token = config.discordToken;
  }

  /**
   * Send text message to text channel.
   *
   * @param {Message} message - Message object
   * @param {string} text - text message
   * @param {boolean} author - add sender name to the begin of message
   */
  sendText(message, text, author) {
    message.channel.sendMessage((author ? message.author + ', ' : '') + text);
  }

  /**
   * Send image to text channel.
   *
   * @param {Message} message - Message object
   * @param {string} url - image url
   * @param {string} text - text message
   * @param {boolean} author - add sender name to the begin of message
   */
  sendImage(message, url, text, author) {
    message.channel.sendMessage(url, '', (author ? message.author + ', ' : '') + text);
  }

  /** Start a bot */
  start() {
    this.ndBot.login(this._token);

    this.ndBot.on('ready', () => {
      console.log('NDbot is ready!');
    });

    this.ndBot.on('message', message => {
      var msg = message.content;
      var command = msg.substr(0, msg.indexOf(' ')) || msg;
      var params = msg.substr(msg.indexOf(' ') + 1);

      switch (command.toLowerCase()) {
        case '+img':
          this._imgSearch.search(message, this, params, 1, 0);
          break;
        case '+rimg':
          var idx = Utils.getRandomInt(0, 9);
          var page = Utils.getRandomInt(0, 99);
          this._imgSearch.search(message, this, params, page, idx);
          break;
        case '+yt':
          this._yt.search(message, this, params);
          break;
        default:
      }
    });
  }
}

module.exports = NDbot;
