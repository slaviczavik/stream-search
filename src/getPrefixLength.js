// Number of match characters in the tail from the end.
function getPrefixLength (haystack, needle) {
  // Number of characters in the haystack trailing data,
  // that match the needle. Counting from the end.
  let j = 0

  // We cannot test the trailing haystack data with Boyer-Moore-Horspool
  // algorithm, because the trailing data is less than the needle size,
  // so we compare these data char by char.
  for (let i = 0; i < haystack.length; i++) {
    if (haystack[i] === needle[j]) {
      // If there is a match, we will check a next character.
      j++
    }
    else {
      // If there is no match, we start from beginning of the needle.
      j = 0
    }
  }

  return j
}

module.exports = { getPrefixLength }
