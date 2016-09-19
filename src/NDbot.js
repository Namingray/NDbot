'use strict';

var rfr = require('rfr');
var directory = require('require-directory');
var request = require('request');
var Discord = require('discord.js');
var Logger = require('./Logger.js');
var Commands = directory(module, './commands');
var Config = rfr('config.json');
var Utils = rfr('src/utils.js');

/** Class representing a discord bot */
class NDbot {

  /** Create a bot */
  constructor() {
    Logger.info('Initializing...');
    this.ndBot = new Discord.Client();
    this._commands = {};
    this._aliases = {};
    this.game = {};
    this.games = [];
    this._voiceChannel = null;
    this._voiceReceiver = null;

    for (let i in Commands) {
      if (Commands.hasOwnProperty(i)) {
        for (let j in Commands[i].commands) {
          if (Commands[i].commands.hasOwnProperty(j)) {
            this._commands[j] = Commands[i].commands[j];
            if (Commands[i].commands[j].aliases !== undefined) {
              for (let k in Commands[i].commands[j].aliases) {
                if (Commands[i].commands[j].aliases.hasOwnProperty(k)) {
                  if (this._aliases[Commands[i].commands[j].aliases[k]]) {
                    throw new Error('Alias "' + Commands[i].commands[j].aliases[k] + '" already have used in other command!');
                  }
                  this._aliases[Commands[i].commands[j].aliases[k]] = Commands[i].commands[j];
                }
              }
            }
          }
        }
      }
    }

    request('http://api.steampowered.com/ISteamApps/GetAppList/v0002/', (error, response, body) => {
      if (!error && response.statusCode === 200) {
        try {
          JSON.parse(body);
        } catch (e) {
          Logger.error('The Steam API returned a bad response.');
          return;
        }
        var steamResponse = JSON.parse(body);
        Logger.info('Added ' + steamResponse.applist.apps.length + ' steam games.');
        this.games = steamResponse.applist.apps;
      }
    });
  }

  /**
   * Join voice channel
   *
   * @param {Message} message - Message object
   * @param {Function} callback - Callback
   */
  _joinVoiceChannel(message, callback = () => {
  }) {
    var channel = message.member.voiceChannel;

    if (channel) {
      channel.join().then(connection => {
        this._voiceChannel = channel;
        this._voiceReceiver = connection.createReceiver();
        this.sendText(message, 'player is ready!', true);
      }).then(callback);
    }
  }

  _chooseGame() {
    var idx = Utils.getRandomInt(0, this.games.length - 1);
    request('http://store.steampowered.com/api/appdetails?appids=' + this.games[idx].appid + '&l=russian', (error, response, body) => {
      try {
        JSON.parse(body);
      } catch (e) {
        Logger.error('The Steam API returned a bad response.');
        return;
      }
      var steamResponse = JSON.parse(body)[this.games[idx].appid];
      if (steamResponse.success === true && steamResponse.data.type === 'game') {
        Logger.info('Was chosen ' + this.games[idx].name + ' as a game');
        this.ndBot.user.setStatus('online', this.games[idx].name);
        this.game = steamResponse.data;
      } else {
        this._chooseGame();
      }
    });
  }

  /** Start a bot */
  start() {
    this.ndBot.login(Config.settings.discordToken);

    this.ndBot.on('ready', () => {
      Logger.info('NDbot is ready!');
      Logger.info('Logged in as ' + this.ndBot.user.username + '/#' + this.ndBot.user.id);
      setInterval(() => {
        this._chooseGame();
      }, 6000);
    });

    this.ndBot.on('message', message => {
      var msg = message.content;
      if (msg[0] === Config.settings.prefix) {
        msg = msg.substring(1);
        var command = msg.substr(0, msg.indexOf(' ')) || msg;
        var params = msg.substr(msg.indexOf(' ') + 1);

        if (this._aliases[command]) {
          command = this._aliases[command].name;
        }

        if (this._commands[command]) {
          Logger.info('Executing "' + message.content + '" from user "' + message.author.username + '"');
          if (this._commands[command].level === 'admin') {
            if (Config.permissions.admin.indexOf(message.author.id) > -1) {
              try {
                this._commands[command].func(message, params, this);
              } catch (e) {
                message.channel.sendMessage('An error occurred while trying to execute this command.\n```' + e + '```');
                Logger.error('Command error, thrown by ' + this._commands[command] + ': ' + e);
              }
            } else {
              message.reply('This command is only allowed for the admins');
            }
          } else {
            try {
              this._commands[command].func(message, params, this);
            } catch (e) {
              message.channel.sendMessage('An error occured while trying to execute this command.\n```' + e + '```');
              Logger.error('Command error, thrown by ' + this._commands[command] + ': ' + e);
            }
          }
        } else {
          message.reply('There is no such command. Use ' + Config.settings.prefix + 'help for available commands');
        }
      }
    });
  }
}

module.exports = NDbot;

/*      switch (command.toLowerCase()) {
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
      }*/


