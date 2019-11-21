const EventEmitter = require('events')

const { toBuffer } = require('./methods/toBuffer')
const { createCharTable } = require('./methods/createCharTable')
const { search } = require('./methods/search')
const { isSuffix } = require('./methods/isSuffix')
const { noPrefixChars } = require('./methods/noPrefixChars')

function StreamSearch (pattern, limit) {
  const emitter = new EventEmitter()
  // The pattern what we are looking for.
  const needle = toBuffer(pattern)
  // The maximum number of matches.
  const maxMatches = Number.isInteger(limit) ? limit : Infinity
  // Char table used for searching.
  const table = createCharTable(needle)

  // The text which will be searched for the pattern.
  let haystack = null
  // Rest of previous request that contains beginning of the needle.
  let prefix = null
  // The current match count.
  let matches = 0
  // Search status.
  let done = false

  function add (data) {
    // Reset search status.
    done = false

    // It also handle the haystack, and tail from previous request.
    haystack = toBuffer(data)
    haystack = processHaystack()

    // If we reached the limit in previous searching.
    if (matches === maxMatches) {
      if (prefix) {
        emitter.emit('part', { isMatch: false, data: prefix })
        prefix = null
      }

      if (haystack) {
        emitter.emit('part', { isMatch: false, data: haystack })
        haystack = null
      }

      return false
    }

    if (prefix && haystack) {
      // Handle the tail from previous request.
      processTail()
    }

    if (haystack) {
      // Proceed to searching.
      processSearch()
    }
  }

  function processHaystack () {
    if (haystack.length === 0) {
      return false
    }

    if (haystack.length >= needle.length) {
      return haystack
    }

    if (prefix) {
      const dataLength = prefix.length + haystack.length

      haystack = Buffer.concat([prefix, haystack], dataLength)

      // If the haystack is long enough now.
      if (dataLength >= needle.length) {
        prefix = null
        return haystack
      }

      prefix = haystack
      return false
    }

    // If there is no tail data from previous request.

    // Number of characters of the haystack that match the needle.
    const matched = noPrefixChars(haystack, needle)

    // Haystack does not contains a needle data.
    if (matched === 0) {
      emitter.emit('part', { isMatch: false, data: haystack })
      return false
    }

    // Whole haystack contains a needle data.
    if (matched === haystack.length) {
      prefix = haystack
      haystack = null
      return false
    }

    // Only characters at the end of the haystack match the needle.
    const end = haystack.length - matched
    emitter.emit('part', { isMatch: false, data: haystack.slice(0, end) })

    prefix = haystack.slice(end)
    haystack = null
    return false
  }

  function processTail () {
    // Test if the beginning of the haystack is a suffix
    // to the prefix from a previous request.
    const isMatch = isSuffix(needle, haystack, prefix)

    if (isMatch) {
      const end = needle.length - prefix.length
      const rest = haystack.slice(0, end)

      const data = Buffer.concat(
        [prefix, rest],
        prefix.length + rest.length
      )

      haystack = haystack.slice(end)

      emitter.emit('part', {
        isMatch: true,
        data: data,
        start: 0,
        end: data.length - 1
      })
    }
    else {
      emitter.emit('part', { isMatch: false, data: prefix })
    }

    prefix = null
  }

  function processSearch () {
    while (done === false) {
      const match = search(needle, haystack, table)

      if (match === false) {
        done = true
      }
      else {
        processMatch(match)

        if (++matches === maxMatches) {
          done = true
        }
      }
    }

    if (haystack.length === 0) {
      return false
    }

    // If we reached the match limit.
    if (matches === maxMatches) {
      emitter.emit('part', { isMatch: false, data: haystack })
      return false
    }

    // Number of characters of the haystack that match the needle.
    const matched = noPrefixChars(haystack, needle)
    // The end position of the haystack that should be emitted to user.
    const end = haystack.length - matched

    // Data that do not match the needle.
    if (end > 0) {
      const data = haystack.slice(0, end)
      emitter.emit('part', { isMatch: false, data: data })
      haystack = haystack.slice(end)
    }

    // If there are still some characters left, but too few to process them.
    if (haystack.length) {
      // We will preserve them for another request.
      prefix = haystack
    }
  }

  function processMatch (index) {
    const end = index + needle.length
    const data = haystack.slice(0, end)

    emitter.emit('part', {
      isMatch: true,
      data: data,
      start: index,
      end: index + needle.length - 1
    })

    haystack = haystack.slice(end)
  }

  function end () {
    if (prefix) {
      emitter.emit('part', { isMatch: false, data: prefix })
    }

    // After searching we reset the state, so we can use
    // this "instance" for a new searching with new data.
    haystack = null
    prefix = null
    matches = 0
  }

  return {
    add: add,
    end: end,
    on: (event, handler) => emitter.on(event, handler)
  }
}

module.exports = StreamSearch
