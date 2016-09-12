'use strict';

var config = require('./config.js');

if (!config.language) {
  config.language = 'en';
}
if (!config.discordToken) {
  console.log('Please, set discordToken in config.js file!');
  process.exit();
}
if (!config.googleSEId) {
  console.log('Please, set googleSEId in config.js file!');
  process.exit();
}
if (!config.googleAPIKey) {
  console.log('Please, set googleAPIKey in config.js file!');
  process.exit();
}

var ndBot = new (require("./src/NDbot"))(config);
ndBot.start();
