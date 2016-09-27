var Commands = [];
var request = require('request');
var rfr = require('rfr');
var Config = rfr('config.json');
var Utils = rfr('src/utils');

Commands.youtube = {
  name: 'youtube',
  aliases: ['yt', 'y'],
  help: '',
  func: function(message, query) {
    request('https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + query + '&type=video&key=' + Config.apiKeys.google.apiKey, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        try {
          JSON.parse(body);
        } catch (e) {
          message.channel.sendMessage(bot.locale.youtubeError);
          return;
        }
        var ytResponse = JSON.parse(body);
        message.reply('your video: https://youtu.be/' + ytResponse.items[0].id.videoId);
      }
    });
  }
};

Commands.img = {
  name: 'img',
  help: '',
  func: function(message, query, bot) {
    request('https://www.googleapis.com/customsearch/v1?q=' + query + '&num=1&start=1&imgSize=medium&searchType=image&fileType=jpg&key=' + Config.apiKeys.google.apiKey + '&cx=' + Config.apiKeys.google.seId, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        try {
          JSON.parse(body);
        } catch (e) {
          message.channel.sendMessage(bot.locale.imgError);
          return;
        }
        var gImageResponse = JSON.parse(body);
        if (gImageResponse.items.length) {
          message.channel.sendFile(gImageResponse.items[0].link);
        } else {
          message.reply(bot.locale.notFound);
        }
      }
    });
  }
};

Commands.rimg = {
  name: 'rimg',
  help: '',
  func: function(message, query, bot) {
    var idx = Utils.getRandomInt(0, 9);
    var page = Utils.getRandomInt(0, 99);
    request('https://www.googleapis.com/customsearch/v1?q=' + query + '&num=' + idx + '&start=' + page + '&imgSize=medium&searchType=image&fileType=jpg&key=' + Config.apiKeys.google.apiKey + '&cx=' + Config.apiKeys.google.seId, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        try {
          JSON.parse(body);
        } catch (e) {
          message.channel.sendMessage(bot.locale.imgError);
          return;
        }
        var gImageResponse = JSON.parse(body);
        if (gImageResponse.items.length) {
          message.channel.sendFile(gImageResponse.items[0].link);
        } else {
          message.reply(bot.locale.notFound);
        }
      }
    });
  }
};

exports.commands = Commands;
