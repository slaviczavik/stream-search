const toBuffer = function (input) {
  if (typeof input === 'string') {
    input = Buffer.from(input)
  }
  else if (!Buffer.isBuffer(input)) {
    input = Buffer.alloc(0)
  }

  return input
}

const createCharTable = function (pattern) {
  // Support for ASCII Table (https://www.asciitable.com/).
  const ALPHABET_SIZE = 256

  let table = []

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

const search = function (needle, haystack, table) {
  // Number of safely skipped characters in the haystack.
  let skip = 0

  // Loop until there is enough characters to read.
  // while (haystack.length - skip >= needle.length) {
  while (haystack.length - skip >= needle.length) {
    let i = needle.length - 1
    while (haystack[skip + i] === needle[i]) {
      if (i-- === 0) {
        return skip
      }
    }

    skip += table[haystack[skip + needle.length - 1]]
  }

  return false
}

module.exports = { toBuffer, createCharTable, search }
