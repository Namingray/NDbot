'use strict';

if (!process.argv[2]) {
  console.log("Please, pass Discord App Token as first command line argument");
  process.exit();
} else if (!process.argv[3]) {
  console.log("Please, pass Search Engine ID as second command line argument");
  process.exit();
} else if (!process.argv[4]) {
  console.log("Please, pass Google API key as third command line argument");
  process.exit();
}

var ndBot = new (require("./src/NDbot"))(process.argv);
ndBot.start();
