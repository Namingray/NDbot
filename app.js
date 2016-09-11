var Discord = require("discord.js");

var bot = new Discord.Client();

bot.on("message", function(message) {
  if (message.content === "hi") {
    bot.reply(message, "hello");
  }
});

bot.loginWithToken("MjI0NDUwMTMyNjA5ODU5NTg0.CrarJA.GxfCnQQ7sGgPWrGCJEv0KHho-pI");