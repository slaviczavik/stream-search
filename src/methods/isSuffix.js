function isSuffix (needle, haystack, prefix) {
  // The tail match the beginning of the needle, so we are going to
  // test the beginning of the haystack if it match the needle.
  for (let i = 0; i < needle.length - prefix.length; i++) {
    if (needle[prefix.length + i] !== haystack[i]) {
      return false
    }
  }

  return true
}

module.exports = { isSuffix }
