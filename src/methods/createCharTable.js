const createCharTable = function (pattern) {
  // Support for ASCII Table (https://www.asciitable.com/).
  const ALPHABET_SIZE = 256

  const table = []

  for (let i = 0; i < ALPHABET_SIZE; i++) {
    table[i] = pattern.length
  }

  // Example for `AQD` pattern:
  // A = (65 => 2), 2 at index 65 (ASCII)
  // Q = (81 => 1), 1 at index 81 (ASCII)
  // ------------------------------------
  // D = (68 => 3), 3 at index 68 (ASCII)
  for (let i = 0; i < pattern.length - 1; i++) {
    table[pattern[i]] = pattern.length - 1 - i
  }

  // It contains data about each character in needle,
  // which is used for safe haystack skipping.
  return table
}

module.exports = { createCharTable }
