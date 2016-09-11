'use strict';
var Discord = require('discord.js');
var TOKEN = 'MjI0NDUwMTMyNjA5ODU5NTg0.CrarJA.GxfCnQQ7sGgPWrGCJEv0KHho-pI';

class NDbot {

  constructor() {
    this.ndBot = new Discord.Client();
  }

  start() {
    this.ndBot.login(TOKEN);

    this.ndBot.on('ready', () => {
      console.log('NDbot is ready!');
    });

    this.ndBot.on('message', message => {
      switch (message.content) {
        case 'hi':
          message.channel.sendMessage(message.author + ', hello');
          break;
        default:
      }
    });
  }
}

module.exports = NDbot;
