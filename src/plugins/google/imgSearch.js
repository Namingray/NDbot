'use strict';
var googleImages = require('google-images');

/** Google images search class */
class ImgSearch {

  /** Create search engine
   *
   * @param {string} SEid - Google Search Engine ID
   * @param {string} GoogleAPIkey - Google API key
   */
  constructor(SEid, GoogleAPIkey) {
    this._client = googleImages(SEid, GoogleAPIkey);
  }

  /** Search an image
   *
   * @param {Message} message - Message object
   * @param {NDbot} bot - Bot object
   * @param {string} query - Search query
   * @param {int} page - Page number
   * @param {int} idx - Index of image on a page
   */
  search(message, bot, query, page, idx) {
    this._client.search(query, {
      page: page
    }).then(images => {
      if (images.length === 0) {
        bot.sendText(message, 'try again!', true);
      } else {
        var results = images.filter(image => {
          return image.type === 'image/jpeg';
        });
        bot.sendImage(message, results[idx > results.length ? idx - results.length : idx].url.split('?')[0], '"' + query + '" result:', true);
      }
    }, reason => {
      NDbot.sendText(message, reason, false);
    });
  }
}

module.exports = ImgSearch;
