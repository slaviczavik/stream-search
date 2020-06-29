/**
 * Boyer–Moore–Horspool algorithm.
 *
 * @param {Buffer} needle
 * @param {Buffer} haystack
 * @param {Array} table
 * @returns {Object}
 */
const matcher = function (haystack, needle, table) {
  const needleLength = needle.length
  // Number of safely skipped characters in the haystack.
  let skip = 0

  // Loop until there is enough characters to read.
  while (haystack.length - skip >= needleLength) {
    let i = needleLength - 1

    // Start comparing needle from right side.
    while (haystack[skip + i] === needle[i]) {
      // It found a match!
      if (i === 0) {
        return { match: true, skip: skip }
      }

      i--
    }

    // No match, skip about n characters.
    const key = haystack[skip + needleLength - 1]
    skip += table[key] ? table[key] : needleLength
  }

  // No match at all.
  return { match: false, skip: skip }
}

module.exports = { matcher }
