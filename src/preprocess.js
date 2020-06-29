/**
 * Makes a jump table based on the mismatched character information.
 *
 * @param {Buffer} pattern
 * @returns {Object}
 */
const preprocess = function (pattern) {
  const table = {}

  // Example for `ANT` pattern:
  // pattern = Buffer(3) { 0: 65, 1: 78, 2: 84 }
  // dictionary = { "65": 2, "78": 1 }
  // -> 65 = A
  // -> 78 = N
  for (let i = 0; i < pattern.length - 1; i++) {
    table[pattern[i]] = pattern.length - 1 - i
  }

  return table
}

module.exports = { preprocess }
