'use strict';

var Discord = require('discord.js');
var ImgSearch = require('./plugins/google/imgSearch.js');
var YouTube = require('./plugins/google/youtube.js');
var Steam = require('./plugins/games/steam.js');
var Utils = require('./utils.js');
var ytdl = require('ytdl-core');

/** Class representing a discord bot */
class NDbot {

  /** Create a bot
   *
   * @param {string} config - Configuration object
   */
  constructor(config) {
    this._ndBot = new Discord.Client();
    this._imgSearch = new ImgSearch(this, config.googleSEId, config.googleAPIKey);
    this._yt = new YouTube(this, config.googleAPIKey);
    this._steam = new Steam(this, config.steamAPIKey);
    this._token = config.discordToken;
    this._voiceChannel = null;
    this._voiceReceiver = null;
  }

  /**
   * Set status.
   *
   * @param {string} game - Game name
   */
  setStatus(game) {
    this._ndBot.user.setStatus('online', game);
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
    message.channel.sendFile(url, '', (author ? message.author + ', ' : '') + text);
  }

  /**
   * Join voice channel
   *
   * @param {Message} message - Message object
   * @param {Function} callback - Callback
   */
  _joinVoiceChannel(message, callback = () => {}) {
    var channel = message.member.voiceChannel;

    if (channel) {
      channel.join().then(connection => {
        this._voiceChannel = channel;
        this._voiceReceiver = connection.createReceiver();
        this.sendText(message, 'player is ready!', true);
      }).then(callback);
    }
  }

  /** Start a bot */
  start() {
    this._ndBot.destroy();
    this._ndBot.login(this._token);
    this._ndBot.on('ready', () => {
      console.log('NDbot is ready!');
      this._ndBot.on('message', message => {
        var msg = message.content;
        var command = msg.substr(0, msg.indexOf(' ')) || msg;
        var params = msg.substr(msg.indexOf(' ') + 1);

        switch (command.toLowerCase()) {
          case '+img':
            this._imgSearch.search(message, params, 1, 0);
            break;
          case '+rimg':
            var idx = Utils.getRandomInt(0, 9);
            var page = Utils.getRandomInt(0, 99);
            this._imgSearch.search(message, params, page, idx);
            break;
          case '+yt':
            this._yt.search(message, params);
            break;
          case '+game':
            if (msg === params) {
              this._steam.getCurrentGameInfo(message);
            } else {
              var guild = message.guild;
              if (guild) {
                var user = guild.members.find(member => {
                  return member.user.username === params;
                });
                this._steam.getUserGameInfo(message, user.user);
              }
            }
            break;
          case '+p':
          case '+player':
            try {
              if (msg === params) {
                this._joinVoiceChannel(message);
              } else
              switch (params) {
                case 'l':
                case 'leave':
                  if (this._voiceChannel) {
                    this._voiceChannel.leave();
                  }
                  break;
                case 's':
                case 'stop':
                  this._voiceChannel.player.stop();
                  this._voiceReceiver.connection.stopPlaying();
                  break;
                default:
                  if (this._voiceChannel === null) {
                    this._joinVoiceChannel(message, () => {
                      var streamOptions = {
                        seek: 0,
                        volume: 0.1
                      };
                      var stream = ytdl(params, {
                        filter: 'audioonly'
                      });
                      this._voiceReceiver.connection.playStream(stream, streamOptions);
                    });
                  }
              }
            } catch (e) {
              console.log(e);
            }
            break;
          default:
        }
      });
    });
  }
}

module.exports = NDbot;
