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

module.exports = { search }
