/**
 * Creates a table containing for each symbol in the alphabet,
 * the number of characters that can be safely skipped.
 *
 * @param {Buffer} pattern
 * @returns {Array}
 */
const preprocess = function (pattern) {
  // Support for ASCII Table (https://www.asciitable.com/).
  const ALPHABET_SIZE = 127

  const table = []

  for (let i = 0; i < ALPHABET_SIZE; i++) {
    // Set default value for all elements in the table.
    table[i] = pattern.length
  }

  // Example for `ANT` pattern:
  // +———————+———————+———————+———————+———————+———————+
  // | 65: A |  ...  | 78: N |  ...  | 84: T |  ...  |
  // +———————+———————+———————+———————+———————+———————+
  // |   2   |   3   |   1   |   3   |   3   |   3   |
  // +———————+———————+———————+———————+———————+———————+

  // pattern = Buffer(3) {0: 65, 1: 81, 2: 68}
  // 0: A (65) = 2
  // 1: N (78) = 1
  for (let i = 0; i < pattern.length - 1; i++) {
    table[pattern[i]] = pattern.length - 1 - i
  }

  return table
}

module.exports = { preprocess }
