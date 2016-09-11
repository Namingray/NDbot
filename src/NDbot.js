'use strict';
var TOKEN = 'MjI0NDUwMTMyNjA5ODU5NTg0.CrarJA.GxfCnQQ7sGgPWrGCJEv0KHho-pI';

var Discord = require('discord.js');
var ImgSearch = require('./plugins/google/imgSearch.js');
var Utils = new (require('./utils'))();

/** Class representing a discord bot */
class NDbot {

  /** Create a bot */
  constructor() {
    this.ndBot = new Discord.Client();
    this.imgSearch = new ImgSearch();
  }

  /** Start a bot */
  start() {
    this.ndBot.login(TOKEN);

    this.ndBot.on('ready', () => {
      console.log('NDbot is ready!');
    });

    this.ndBot.on('message', message => {
      var msg = message.content;
      var command = msg.substr(0, msg.indexOf(' ')) || msg;
      var params = msg.substr(msg.indexOf(' ') + 1);

      switch (command) {
        case '+img':
          this.imgSearch.search(params).then(images => {
            if (images.length === 0) {
              message.channel.sendMessage(message.author + ', try again');
            } else {
              message.channel.sendFile(images[0].url, '', message.author + ', "' + params + '" result:');
            }
          });
          break;
        case '+rimg':
          var idx = Utils.getRandomInt(0, 9);
          var page = Utils.getRandomInt(0, 99);

          this.imgSearch.search(params, page).then(images => {
            if (images.length === 0) {
              message.channel.sendMessage(message.author + ', try again');
            } else {
              message.channel.sendFile(images[idx].url, '', message.author + ', "' + params + '" random result:');
            }
          });
          break;
        default:
      }
    });
  }
}

module.exports = NDbot;
