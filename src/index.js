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
    // Create a Buffer from a string.
    haystack = setHaystack(data)

    if (haystack && haystack.length < needle.length) {
      processHaystack()
    }

    // If we reached the limit in previous searching.
    if (matches === maxMatches) {
      flushPrefix()
      flushHaystack()

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
    if (prefix) {
      const dataLength = prefix.length + haystack.length

      haystack = Buffer.concat([prefix, haystack], dataLength)

      // Haystack is not long enough!
      if (dataLength < needle.length) {
        prefix = haystack
        haystack = null
        return false
      }

      prefix = null
      return false
    }

    // If there is no tail data from previous request.
    // Number of characters of the haystack that match the needle.
    const matched = noPrefixChars(haystack, needle)

    if (matched === 0) {
      // Haystack does not contains a needle data.
      flushHaystack()
      return false
    }

    if (matched === haystack.length) {
      // Whole haystack contains a needle data.
      prefix = haystack
      haystack = null
      return false
    }

    // Only characters at the end of the haystack match the needle.
    const end = haystack.length - matched
    emitter.emit('part', { isMatch: false, data: haystack.slice(0, end) })
    prefix = haystack.slice(end)
    haystack = null
  }

  function processTail () {
    // Test if the beginning of the haystack is a suffix to the prefix
    // from a previous request.
    const isMatch = isSuffix(needle, haystack, prefix)

    // There is no match, we don't need a prefix anymore.
    if (!isMatch) {
      flushPrefix()
      return false
    }

    flushTail()
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
      flushHaystack()
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

    // If there are still some characters left, but too few to process them,
    // we will preserve them for another request.
    if (haystack.length) {
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

  function setHaystack (data) {
    if (data.length === 0) {
      return null
    }

    return toBuffer(data)
  }

  function flushTail () {
    const end = needle.length - prefix.length
    const rest = haystack.slice(0, end)

    const data = Buffer.concat(
      [prefix, rest],
      prefix.length + rest.length
    )

    prefix = null
    haystack = haystack.slice(end)

    emitter.emit('part', {
      isMatch: true,
      data: data,
      start: 0,
      end: data.length - 1
    })
  }

  function flushPrefix () {
    if (prefix) {
      emitter.emit('part', { isMatch: false, data: prefix })
      prefix = null
    }
  }

  function flushHaystack () {
    if (haystack) {
      emitter.emit('part', { isMatch: false, data: haystack })
      haystack = null
    }
  }

  function end () {
    flushPrefix()
    flushHaystack()

    // After searching we reset the state, so we can use
    // this "instance" for a new searching with new data.
    matches = 0
  }

  return {
    add: add,
    end: end,
    on: (event, handler) => emitter.on(event, handler)
  }
}

module.exports = StreamSearch
