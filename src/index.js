const EventEmitter = require('events')

const { toBuffer } = require('./toBuffer')
const { matcher } = require('./matcher')
const { preprocess } = require('./preprocess')
const { getPrefixLength } = require('./getPrefixLength')

function StreamSearch (pattern, limit) {
  const emitter = new EventEmitter()
  // The pattern what we are looking for.
  const needle = toBuffer(pattern)
  // The maximum number of matches.
  const maxMatches = Number.isInteger(limit) ? limit : Infinity
  // Char table used for searching.
  const table = preprocess(needle)

  // Current text which will be searched for the pattern.
  let haystack
  // The current match count.
  let matches = 0

  function add (data) {
    // Create a haystack.
    haystack = createHaystack(data)

    // Proceed to searching.
    processSearch()
  }

  function processSearch () {
    while (matches < maxMatches && haystack.length >= needle.length) {
      const { match, skip } = matcher(haystack, needle, table)

      if (match) {
        processMatch(skip)
        matches++
      }
      else {
        // Suffix may contain prefix of the needle.
        const suffix = haystack.slice(skip)
        const prefixLength = getPrefixLength(suffix, needle)

        // Start of a prefix.
        const start = suffix.length - prefixLength
        sliceHaystack(0, skip + start)
      }
    }

    matches === maxMatches
      ? flushHaystack()
      : handlePrefix()
  }

  /**
   * When haystack is shorter than needle, we can check
   * if it contains a prefix of the needle.
   */
  function handlePrefix () {
    // Number of characters of the haystack that match the needle.
    const matched = getPrefixLength(haystack, needle)

    if (matched > 0) {
      // Suffix of the haystack match the prefix of the needle.
      const prefixStart = haystack.length - matched

      if (prefixStart > 0) {
        sliceHaystack(0, prefixStart)
      }
    }
    else {
      // Haystack does not contains a needle data.
      flushHaystack()
    }
  }

  function sliceHaystack (start, end) {
    flush(haystack.slice(start, end))
    haystack = haystack.slice(end)
  }

  /**
   * Creates a haystack for searching from a new string
   * and the previous haystack.
   *
   * @param {String} str
   * @returns {Buffer}
   */
  function createHaystack (str) {
    const data = toBuffer(str)

    if (haystack) {
      const dataLength = haystack.length + data.length
      return Buffer.concat([haystack, data], dataLength)
    }

    return data
  }

  /**
   * Emit a match and update the haystack.
   *
   * @param {Number} index - First occurrence of needle in haystack.
   */
  function processMatch (index) {
    const end = index + needle.length
    const data = haystack.slice(0, end)

    haystack = haystack.slice(end)

    emitter.emit('part', {
      isMatch: true,
      data: data,
      start: index,
      end: index + needle.length - 1
    })
  }

  /**
   * Flush data without needle.
   *
   * @param {Buffer} data - Data to flush.
   */
  function flush (data) {
    if (data.length) {
      emitter.emit('part', { isMatch: false, data: data })
    }
  }

  function flushHaystack () {
    if (haystack) {
      flush(haystack)
      haystack = null
    }
  }

  function end () {
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
