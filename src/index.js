const EventEmitter = require('events')

const { toBuffer } = require('./toBuffer')
const { matcher } = require('./matcher')
const { preprocess } = require('./preprocess')
const { prefixLength } = require('./prefixLength')

// TODO: Is HTTP stream in ASCII? Check specifications.

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
  // Search status.
  let done = true

  function add (data) {
    // if (done === false) {
    //   console.log(`Searching in progress, but data ${data} was added!`)
    //
    //   // Add data to the queue!
    //
    //   return false
    // }

    // If we reached the limit in previous searching.
    if (matches === maxMatches) {
      flushHaystack()
      flushInput(data)

      return false
    }

    // Reset search status.
    done = false
    // Create a haystack.
    haystack = createHaystack(data)

    // if (haystack.length < needle.length) {
    //   // If there is no tail data from previous request.
    //   // Number of characters of the haystack that match the needle.
    //   const matched = prefixLength(haystack, needle)
    //
    //   if (matched === 0) {
    //     // Haystack does not contains a needle data.
    //     flushHaystack()
    //   }
    //   else {
    //     // Only characters at the end of the haystack match the needle.
    //     const end = haystack.length - matched
    //
    //     if (end > 0) {
    //       emitter.emit('part', { isMatch: false, data: haystack.slice(0, end) })
    //     }
    //
    //     haystack = haystack.slice(end)
    //   }
    // }

    if (haystack.length >= needle.length) {
      // Proceed to searching.
      processSearch()
    }
  }

  function processSearch () {
    if (done) {
      return true
    }

    const { match, skip } = matcher(haystack, needle, table)

    if (match) {
      processMatch(skip)

      if (++matches === maxMatches) {
        done = true
        flushHaystack()
        return false
      }
      else {
        processSearch()
      }
    }
    else {
      // Leftover, may contain prefix of the needle.
      const suffix = haystack.slice(skip)
      const prefLen = prefixLength(suffix, needle)

      // Start of a tail.
      const start = suffix.length - prefLen

      flush(haystack.slice(0, skip + start))

      haystack = haystack.slice(skip + start)

      // No match in current haystack.
      done = true
    }
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
    if (data) {
      emitter.emit('part', { isMatch: false, data: data })
    }
  }

  function flushInput (str) {
    emitter.emit('part', { isMatch: false, data: toBuffer(str) })
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
