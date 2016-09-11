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
   * @param {string} query - search query
   * @param {Message} message - message object
   */
  search(query, message) {
    this._youtube.search.list({
      part: 'snippet',
      q: query,
      maxResults: 1
    }, (err, data) => {
      if (err) {
        message.channel.sendMessage(message.author + ', something went wrong. Try again!');
      } else {
        message.channel.sendMessage(message.author + ', your video: ' + 'https://youtu.be/' + data.items[0].id.videoId);
      }
    });
  }
}

module.exports = YouTube;
