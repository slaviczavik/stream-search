const EventEmitter = require('events')

class StringSearch extends EventEmitter {
  constructor (needle, limit) {
    super()

    // The pattern what we are looking for.
    this.needle = toBuffer(needle)
    // The text which will be searched for the pattern.
    this.haystack = null
    // Untested data from previous request, if any.
    this.tail = null
    // The current match count.
    this.matches = 0
    // The maximum number of matches.
    this.maxMatches = Number.isInteger(limit) ? limit : Infinity
  }

  add (haystack) {
    // Start position of unprocessed haystack.
    this.position = 0
    // Number of safely skipped characters in the haystack.
    this.skip = 0

    // Check the haystack and chain it with previous one.
    this.haystack = this._processHaystack(haystack)

    // If we reached the limit in previous searching.
    if (this.matches === this.maxMatches) {
      if (this.haystack || this.tail) {
        this.emit('part', { isMatch: false, data: this.haystack || this.tail })
      }

      return false
    }

    if (this.haystack) {
      // Proceed to searching.
      this._handleSearch()
    }
  }

  end () {
    if (this.tail) {
      this.emit('part', { isMatch: false, data: this.tail })
    }
  }

  _handleSearch () {
    // Search the haystack for the needle.
    // Use Boyer-Moore-Horspool algorithm.
    const result = this._search(this.needle, this.haystack)

    for (let i of result) {
      this._processMatch(i)

      // Stop the algorithm if we reached the limit.
      if (++this.matches === this.maxMatches) {
        break
      }
    }

    // If we already reached the end of the haystack.
    // Everything before `position` was already emitted.
    if (this.position === this.haystack.length) {
      return false
    }

    // If we reached the match limit.
    if (this.matches === this.maxMatches) {
      const data = this.haystack.slice(this.position, this.haystack.length)
      this.emit('part', { isMatch: false, data: data })
      return false
    }

    // The end position of the haystack that should be emitted to user.
    let end = this._findSaveEnd()

    // Emit the string between last position and the current end.
    if (this.position < end) {
      const data = this.haystack.slice(this.position, end)
      this.emit('part', { isMatch: false, data: data })
    }

    // If there are still some characters left, but too few to process them.
    if (end < this.haystack.length) {
      // We will preserve them for another request.
      this.tail = this.haystack.slice(end, this.haystack.length)
    }
  }

  _findSaveEnd () {
    // Number of characters in the haystack trailing data,
    // that match the needle. Counting from the end.
    let j = 0

    // We cannot test the trailing haystack data with Boyer-Moore-Horspool
    // algorithm, because the trailing data is less than the needle size,
    // so we compare these data char by char.
    for (let i = this.skip; i < this.haystack.length; i++) {
      if (this.haystack[i] === this.needle[j]) {
        // If there is a match, we will check a next character.
        j++
      }
      else {
        // If there is no match, we start from beginning of the needle.
        j = 0
      }
    }

    // Return the end of the haystack that should be emitted to user.
    return this.haystack.length - j
  }

  _processHaystack (haystack) {
    haystack = toBuffer(haystack)

    // If we have unprocessed data from previous request.
    if (Buffer.isBuffer(this.tail)) {
      let len = this.tail.length + haystack.length
      // Returns a new Buffer which is the result of concatenating
      // all the Buffer instances in the list together.
      haystack = Buffer.concat([this.tail, haystack], len)
    }

    // Reset the tail.
    this.tail = null

    // If the haystack is empty.
    if (haystack.length === 0) {
      return false
    }

    // If the haystack is not long enough.
    if (haystack.length < this.needle.length) {
      // Save it for next request.
      this.tail = haystack
      // Clear the haystack.
      haystack = null

      return false
    }

    return haystack
  }

  _processMatch (index) {
    const bufferS = this.position
    const bufferE = bufferS + (index - bufferS) + this.needle.length
    const indexS = index - this.position
    const indexE = indexS + this.needle.length - 1

    this.emit('part', {
      isMatch: true,
      data: this.haystack.slice(bufferS, bufferE),
      start: indexS,
      end: indexE
    })

    // All until this position was safely processed.
    this.position = bufferE
  }

  * _search (needle, haystack) {
    // It contains data about each character in needle,
    // which is used for safe haystack skipping.
    const table = createCharTable(needle)
    // Number of safely skipped characters in the haystack.
    let skip = 0

    // Loop until there is enough characters to read.
    while (haystack.length - skip >= needle.length) {
      for (let i = needle.length - 1; haystack[skip + i] === needle[i]; i--) {
        if (i === 0) {
          yield this.skip
          break
        }
      }

      // Move the needle to the right.
      this.skip = skip += table[haystack[skip + needle.length - 1]]
    }
  }
}

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
  // D = (68 => 0), 0 at index 68 (ASCII)
  for (let i = 0; i < pattern.length - 1; i++) {
    table[pattern[i]] = pattern.length - 1 - i
  }

  return table
}

module.exports = StringSearch
