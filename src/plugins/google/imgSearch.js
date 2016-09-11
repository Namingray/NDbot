'use strict';
var googleImages = require('google-images');

/** Google images search class */
class ImgSearch {

  /** Create search engine */
  constructor() {
    this.client = googleImages('000758309876721190547:2henfhr4o18', 'AIzaSyDMbE53QXhIXJKAiMXFdwmzzpgDkg168Tg');
  }

  /** Search an image
   *
   * @param {string} query - search query
   * @param {int} page - page number
   * @return {Promise} - A promise that return an array of images if resolved
   */
  search(query, page) {
    return this.client.search(query, {
      page: page || 1
    });
  }
}

module.exports = ImgSearch;
