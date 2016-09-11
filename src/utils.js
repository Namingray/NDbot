'use strict';

/** Utility class */
class Utils {

  /**
   * Get a random integer between `min` and `max`.
   *
   * @param {number} min - min number
   * @param {number} max - max number
   * @return {int} a random integer
   */
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /**
   * Get a random floating point number between `min` and `max`.
   *
   * @param {number} min - min number
   * @param {number} max - max number
   * @return {number} a random floating point number
   */
  getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }
}

module.exports = Utils;
