const assert = require('assert')
const StreamSearch = require('../src/index.js')

describe('AQD in (AQD)', function () {
  it('Should be found in (AQD) at [0 - 2]', function (done) {
    const search = StreamSearch('AQD')

    search.on('part', function (o) {
      assert.strictEqual(o.isMatch, true)
      assert.strictEqual(o.start, 0)
      assert.strictEqual(o.end, 2)
      assert.strictEqual(o.data.toString('ascii'), 'AQD')
      done()
    })

    search.add('AQD')
    search.end()
  })
})

describe('AQD in (AQX)', function () {
  it('Should not be found in (AQX)', function (done) {
    const search = StreamSearch('AQD')

    search.on('part', function (o) {
      assert.strictEqual(o.isMatch, false)
      assert.strictEqual(o.start, undefined)
      assert.strictEqual(o.end, undefined)
      assert.strictEqual(o.data.toString('ascii'), 'AQX')
      done()
    })

    search.add('AQX')
    search.end()
  })
})

describe('AQD in (XQD)', function () {
  it('Should not be found in (XQD)', function (done) {
    const search = StreamSearch('AQD')

    search.on('part', function (o) {
      assert.strictEqual(o.isMatch, false)
      assert.strictEqual(o.start, undefined)
      assert.strictEqual(o.end, undefined)
      assert.strictEqual(o.data.toString('ascii'), 'XQD')
      done()
    })

    search.add('XQD')
    search.end()
  })
})

describe('AQD in (AQ)', function () {
  it('Should not be found in (AQ)', function (done) {
    const search = StreamSearch('AQD')

    search.on('part', function (o) {
      assert.strictEqual(o.isMatch, false)
      assert.strictEqual(o.start, undefined)
      assert.strictEqual(o.end, undefined)
      assert.strictEqual(o.data.toString('ascii'), 'AQ')
      done()
    })

    search.add('AQ')
    search.end()
  })
})
