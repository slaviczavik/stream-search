const assert = require('assert')
const StreamSearch = require('../src/index.js')

describe('ANT in ANT', function () {
  it('Should be found in ANT at [0 - 2]', function (done) {
    const search = StreamSearch('ANT')

    search.on('part', function (o) {
      assert.strictEqual(o.isMatch, true)
      assert.strictEqual(o.start, 0)
      assert.strictEqual(o.end, 2)
      assert.strictEqual(o.data.toString('ascii'), 'ANT')
      done()
    })

    search.add('ANT')
    search.end()
  })
})

describe('ANT in ANZ', function () {
  it('Should not be found in ANZ', function (done) {
    const search = StreamSearch('ANT')

    search.on('part', function (o) {
      assert.strictEqual(o.isMatch, false)
      assert.strictEqual(o.start, undefined)
      assert.strictEqual(o.end, undefined)
      assert.strictEqual(o.data.toString('ascii'), 'ANZ')
      done()
    })

    search.add('ANZ')
    search.end()
  })
})

describe('ANT in FOO', function () {
  it('Should not be found in FOO', function (done) {
    const search = StreamSearch('ANT')

    search.on('part', function (o) {
      assert.strictEqual(o.isMatch, false)
      assert.strictEqual(o.start, undefined)
      assert.strictEqual(o.end, undefined)
      assert.strictEqual(o.data.toString('ascii'), 'FOO')
      done()
    })

    search.add('FOO')
    search.end()
  })
})

describe('ANT in AN', function () {
  it('Should not be found in AN', function (done) {
    const search = StreamSearch('ANT')

    search.on('part', function (o) {
      assert.strictEqual(o.isMatch, false)
      assert.strictEqual(o.start, undefined)
      assert.strictEqual(o.end, undefined)
      assert.strictEqual(o.data.toString('ascii'), 'AN')
      done()
    })

    search.add('AN')
    search.end()
  })
})
