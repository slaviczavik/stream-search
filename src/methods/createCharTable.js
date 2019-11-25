const createCharTable = function (pattern) {
  // Support for ASCII Table (https://www.asciitable.com/).
  const ALPHABET_SIZE = 127

  const table = []

  for (let i = 0; i < ALPHABET_SIZE; i++) {
    // Set default value for all elements in the table.
    table[i] = pattern.length
  }

  // Example for `AQD` pattern:
  // A = 65 (ASCII) -> 65: (3 - 1 - 0) = 2
  // Q = 81 (ASCII) -> 81: (3 - 1 - 1) = 1
  for (let i = 0; i < pattern.length - 1; i++) {
    table[pattern[i]] = pattern.length - 1 - i
  }

  // It contains data about each character in needle,
  // which is used for safe haystack skipping.
  return table
}

module.exports = { createCharTable }
