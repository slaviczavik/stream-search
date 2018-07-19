const assert = require('assert')
const StreamSearch = require('../lib')
/*
describe('AQD in (AQD)', function () {
  it('Should be found in (AQD) at [0 - 2]', function (done) {
    let search = new StreamSearch('AQD')

    search.on('part', function (o) {
      assert.equal(o['isMatch'], true)
      assert.equal(o['start'], 0)
      assert.equal(o['end'], 2)
      assert.equal(o['data'].toString('ascii'), 'AQD')
      done()
    })

    search.add('AQD')
    search.end()
  })
})

describe('AQD in (AQX)', function () {
  it('Should not be found in (AQX)', function (done) {
    let search = new StreamSearch('AQD')

    search.on('part', function (o) {
      assert.equal(o['isMatch'], false)
      assert.equal(o['start'], undefined)
      assert.equal(o['end'], undefined)
      assert.equal(o['data'].toString('ascii'), 'AQX')
      done()
    })

    search.add('AQX')
    search.end()
  })
})

describe('AQD in (XQD)', function () {
  it('Should not be found in (XQD)', function (done) {
    let search = new StreamSearch('AQD')

    search.on('part', function (o) {
      assert.equal(o['isMatch'], false)
      assert.equal(o['start'], undefined)
      assert.equal(o['end'], undefined)
      assert.equal(o['data'].toString('ascii'), 'XQD')
      done()
    })

    search.add('XQD')
    search.end()
  })
})

describe('AQD in (AQ)', function () {
  it('Should not be found in (AQ)', function (done) {
    let search = new StreamSearch('AQD')

    search.on('part', function (o) {
      assert.equal(o['isMatch'], false)
      assert.equal(o['start'], undefined)
      assert.equal(o['end'], undefined)
      assert.equal(o['data'].toString('ascii'), 'AQ')
      done()
    })

    search.add('AQ')
    search.end()
  })
})
*/
