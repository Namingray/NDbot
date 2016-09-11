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
   * @param {string} query - search query
   * @param {int} page - page number
   * @return {Promise} - A promise that return an array of images if resolved
   */
  search(query, page) {
    return this._client.search(query, {
      page: page || 1
    });
  }
}

module.exports = ImgSearch;
