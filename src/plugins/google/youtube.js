'use strict';

var google = require('googleapis');

/** YouTube class */
class YouTube {

  /** Create YT class
   *
   * @param {string} googleAPIkey - Google API key
   */
  constructor(googleAPIkey) {
    this._youtube = google.youtube({
      version: 'v3',
      auth: googleAPIkey
    });
  }

  /** Search a video
   *
   * @param {Message} message - Message object
   * @param {NDbot} bot - Bot object
   * @param {string} query - Search query
   *
   */
  search(message, bot, query) {
    this._youtube.search.list({
      part: 'snippet',
      q: query,
      maxResults: 1
    }, (err, data) => {
      if (err) {
        bot.sendText(message, 'something went wrong. Try again!', true);
      } else {
        bot.sendText(message, 'your video: https://youtu.be/' + data.items[0].id.videoId, true);
      }
    });
  }
}

module.exports = YouTube;
