'use strict';

var google = require('googleapis');

/** YouTube class */
class YouTube {

  /** Create YT class
   *
   * param {NDbot} bot - Bot object
   * @param {string} googleAPIkey - Google API key
   */
  constructor(bot, googleAPIkey) {
    this._bot = bot;
    this._youtube = google.youtube({
      version: 'v3',
      auth: googleAPIkey
    });
  }

  /** Search a video
   *
   * @param {Message} message - Message object
   * @param {string} query - Search query
   *
   */
  search(message, query) {
    this._youtube.search.list({
      part: 'snippet',
      q: query,
      maxResults: 1
    }, (err, data) => {
      if (err) {
        this._bot.sendText(message, 'something went wrong. Try again!', true);
      } else {
        this._bot.sendText(message, 'your video: https://youtu.be/' + data.items[0].id.videoId, true);
      }
    });
  }
}

module.exports = YouTube;
