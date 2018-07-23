const EventEmitter = require('events')
const { toBuffer, createCharTable, search } = require('./util')

class StreamSearch extends EventEmitter {
  constructor (needle, limit) {
    super()

    // The pattern what we are looking for.
    this.needle = toBuffer(needle)
    // The text which will be searched for the pattern.
    this.haystack = null
    // Rest of previous request that contains beginning of the needle.
    this.prefix = null
    // The current match count.
    this.matches = 0
    // The maximum number of matches.
    this.maxMatches = Number.isInteger(limit) ? limit : Infinity
    // Char table used for searching.
    this.table = createCharTable(this.needle)
  }

  add (haystack) {
    // Reset search status.
    this.done = false

    // It also handle the haystack, and tail from previous request.
    const canProceed = this._prepareSearching(haystack)

    if (this.haystack && canProceed) {
      // Proceed to searching.
      this._search()
    }
  }

  end () {
    if (this.prefix) {
      this.emit('part', { isMatch: false, data: this.prefix })
    }

    // After searching we reset the state, so we can use
    // this "instance" for a new searching with new data.
    this._reset()
  }

  _prepareSearching (haystack) {
    this.haystack = this._processHaystack(haystack)

    // If we reached the limit in previous searching.
    if (this.matches === this.maxMatches) {
      if (this.prefix) {
        this.emit('part', { isMatch: false, data: this.prefix })
        this.prefix = null
      }

      if (this.haystack) {
        this.emit('part', { isMatch: false, data: this.haystack })
        this.haystack = null
      }

      return false
    }

    // Handle the tail from previous request.
    this._processTail()

    return true
  }

  _search () {
    while (this.done === false) {
      let match = search(this.needle, this.haystack, this.table)

      if (match === false) {
        this.done = true
      }
      else {
        this._processMatch(match)

        if (++this.matches === this.maxMatches) {
          this.done = true
        }
      }
    }

    this._afterSarch()
  }

  _processHaystack (haystack) {
    haystack = toBuffer(haystack)

    if (haystack.length === 0) {
      return false
    }

    if (haystack.length >= this.needle.length) {
      return haystack
    }

    if (this.prefix) {
      haystack = Buffer.concat(
        [ this.prefix, haystack ],
        this.prefix.length + haystack.length
      )

      // If the haystack is long enough now.
      if (haystack.length + this.prefix.length >= this.needle.length) {
        this.prefix = null
        return haystack
      }
      else {
        this.prefix = haystack
        return false
      }
    }
    // If there is no tail data from previous request.
    else {
      // Number of characters of the haystack that match the needle.
      const matched = this._noPrefixChars(haystack)

      // Haystack does not contains a needle data.
      if (matched === 0) {
        this.emit('part', { isMatch: false, data: haystack })
        return false
      }
      // Whole haystack contains a needle data.
      else if (matched === haystack.length) {
        this.prefix = haystack
        haystack = null
        return false
      }
      // Only characters at the end of the haystack match the needle.
      else {
        const end = haystack.length - matched
        this.emit('part', { isMatch: false, data: haystack.slice(0, end) })

        this.prefix = haystack.slice(end)
        haystack = null
        return false
      }
    }
  }

  _processTail () {
    if (this.prefix && this.haystack) {
      // Test if the beginning of the haystack is a suffix
      // to the prefix from a previous request.
      let isMatch = this._isSuffix()

      if (isMatch) {
        const end = this.needle.length - this.prefix.length
        const rest = this.haystack.slice(0, end)

        const data = Buffer.concat(
          [ this.prefix, rest ],
          this.prefix.length + rest.length
        )

        this.haystack = this.haystack.slice(end)

        this.emit('part', {
          isMatch: true,
          data: data,
          start: 0,
          end: data.length - 1
        })
      }
      else {
        this.emit('part', { isMatch: false, data: this.prefix })
      }

      this.prefix = null
    }
  }

  _processMatch (index) {
    const end = index + this.needle.length
    const data = this.haystack.slice(0, end)

    this.emit('part', {
      isMatch: true,
      data: data,
      start: index,
      end: index + this.needle.length - 1
    })

    this.haystack = this.haystack.slice(end)
  }

  _afterSarch () {
    if (this.haystack.length === 0) {
      return false
    }

    // If we reached the match limit.
    if (this.matches === this.maxMatches) {
      this.emit('part', { isMatch: false, data: this.haystack })
      return false
    }

    // Number of characters of the haystack that match the needle.
    let matched = this._noPrefixChars(this.haystack)
    // The end position of the haystack that should be emitted to user.
    let end = this.haystack.length - matched

    // Data that do not match the needle.
    if (end > 0) {
      const data = this.haystack.slice(0, end)
      this.emit('part', { isMatch: false, data: data })
      this.haystack = this.haystack.slice(end)
    }

    // If there are still some characters left, but too few to process them.
    if (this.haystack.length) {
      // We will preserve them for another request.
      this.prefix = this.haystack
    }
  }

  _isSuffix () {
    // The tail match the beginning of the needle, so we are going to
    // test the beginning of the haystack if it match the needle.
    for (let i = 0; i < this.needle.length - this.prefix.length; i++) {
      if (this.needle[this.prefix.length + i] !== this.haystack[i]) {
        return false
      }
    }

    return true
  }

  // Number of match characters in the tail from the end.
  _noPrefixChars (haystack) {
    // Number of characters in the haystack trailing data,
    // that match the needle. Counting from the end.
    let j = 0

    // We cannot test the trailing haystack data with Boyer-Moore-Horspool
    // algorithm, because the trailing data is less than the needle size,
    // so we compare these data char by char.
    for (let i = 0; i < haystack.length; i++) {
      if (haystack[i] === this.needle[j]) {
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

  _reset () {
    this.haystack = null
    this.prefix = null
    this.matches = 0
  }
}

module.exports = StreamSearch
