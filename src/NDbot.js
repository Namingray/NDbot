'use strict';
var TOKEN = 'MjI0NDUwMTMyNjA5ODU5NTg0.CrarJA.GxfCnQQ7sGgPWrGCJEv0KHho-pI';

var Discord = require('discord.js');
var ImgSearch = require('./plugins/google/imgSearch.js');
var Utils = require('./utils');

/** Class representing a discord bot */
class NDbot {

  /** Create a bot */
  constructor() {
    this._ndBot = new Discord.Client();
    this._imgSearch = new ImgSearch();
  }

  /**
   * Process array of image and sent proper image to channel.
   *
   * @param {Message} message - message object
   * @param {Array<Image>} images - array of images
   * @param {int} idx - image idx
   * @param {string} string - string query
   */
  _processImage(message, images, idx, string) {
    if (images.length === 0) {
      message.channel.sendMessage(message.author + ', try again');
    } else {
      var results = images.filter(image => {
        return image.type === 'image/jpeg';
      });
      message.channel.sendFile(results[idx > results.length ? idx - results.length : idx].url, '', message.author + ', "' + string + '" result:');
    }
  }

  /** Start a bot */
  start() {
    this._ndBot.login(TOKEN);

    this._ndBot.on('ready', () => {
      console.log('NDbot is ready!');
    });

    this._ndBot.on('message', message => {
      var msg = message.content;
      var command = msg.substr(0, msg.indexOf(' ')) || msg;
      var params = msg.substr(msg.indexOf(' ') + 1);

      switch (command) {
        case '+img':
          this._imgSearch.search(params).then(images => {
            this._processImage(message, images, 0, params);
          }, reason => {
            message.channel.sendMessage(reason);
          });
          break;
        case '+rimg':
          var idx = Utils.getRandomInt(0, 9);
          var page = Utils.getRandomInt(0, 99);

          this._imgSearch.search(params, page).then(images => {
            this._processImage(message, images, idx, params);
          }, reason => {
            message.channel.sendMessage(reason);
          });
          break;
        default:
      }
    });
  }
}

module.exports = NDbot;
