'use strict';
var googleImages = require('google-images');

/** Google images search class */
class ImgSearch {

  /** Create search engine
   *
   * @param {NDbot} bot - Bot object
   * @param {string} SEid - Google Search Engine ID
   * @param {string} GoogleAPIkey - Google API key
   */
  constructor(bot, SEid, GoogleAPIkey) {
    this._bot = bot;
    this._client = googleImages(SEid, GoogleAPIkey);
  }

  /** Search an image
   *
   * @param {Message} message - Message object
   * @param {string} query - Search query
   * @param {int} page - Page number
   * @param {int} idx - Index of image on a page
   */
  search(message, query, page, idx) {
    this._client.search(query, {
      page: page
    }).then(images => {
      if (images.length === 0) {
        this._bot.sendText(message, 'try again!', true);
      } else {
        var results = images.filter(image => {
          return image.type === 'image/jpeg';
        });
        this._bot.sendImage(message, results[idx > results.length ? idx - results.length : idx].url.split('?')[0], '', false);
      }
    }, reason => {
      this._bot.sendText(message, reason, false);
    });
  }
}

module.exports = ImgSearch;
