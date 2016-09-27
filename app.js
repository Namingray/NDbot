'use strict';

process.title = 'NDbot';

try {
  var config = require('./config.json');
  var ndBot = new (require("./src/NDbot"))(config);
} catch (e) {
  console.log('\nNDbot can not find config.json file or it is corrupted, please resolve this issue and restart the bot\n\n' + e.message);
  process.exit();
}