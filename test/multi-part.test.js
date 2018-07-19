const assert = require('assert')
const StreamSearch = require('../lib')

describe('AQD in (AQD, FF)', function () {
  it('Should be found in (AQD) at [0 - 2]', function (done) {
    let search = new StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 0) {
        assert.equal(o['isMatch'], true)
        assert.equal(o['start'], 0)
        assert.equal(o['end'], 2)
        assert.equal(o['data'].toString('ascii'), 'AQD')
        done()
      }
    })

    search.add('AQD')
    search.add('FF')
    search.end()
  })

  it('Should return remaining data (FF)', function (done) {
    let search = new StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 1) {
        assert.equal(o['isMatch'], false)
        assert.equal(o['start'], undefined)
        assert.equal(o['end'], undefined)
        assert.equal(o['data'].toString('ascii'), 'FF')
        done()
      }
    })

    search.add('AQD')
    search.add('FF')
    search.end()
  })
})

describe('AQD in (AQD--)', function () {
  it('Should be found in (AQD) at [0 - 2]', function (done) {
    let search = new StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 0) {
        assert.equal(o['isMatch'], true)
        assert.equal(o['start'], 0)
        assert.equal(o['end'], 2)
        assert.equal(o['data'].toString('ascii'), 'AQD')
        done()
      }
    })

    search.add('AQD--')
    search.end()
  })

  it('Should return remaining data (--)', function (done) {
    let search = new StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 1) {
        assert.equal(o['isMatch'], false)
        assert.equal(o['start'], undefined)
        assert.equal(o['end'], undefined)
        assert.equal(o['data'].toString('ascii'), '--')
        done()
      }
    })

    search.add('AQD--')
    search.end()
  })
})

describe('AQD in (-, -AQD)', function () {
  it('Should not be found in (-)', function (done) {
    let search = new StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 0) {
        assert.equal(o['isMatch'], false)
        assert.equal(o['start'], undefined)
        assert.equal(o['end'], undefined)
        assert.equal(o['data'].toString('ascii'), '-')
        done()
      }
    })

    search.add('-')
    search.add('-AQD')
    search.end()
  })

  it('Should be found in (-AQD) at [1 - 3]', function (done) {
    let search = new StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 1) {
        assert.equal(o['isMatch'], true)
        assert.equal(o['start'], 1)
        assert.equal(o['end'], 3)
        assert.equal(o['data'].toString('ascii'), '-AQD')
        done()
      }
    })

    search.add('-')
    search.add('-AQD')
    search.end()
  })
})

describe('AQD in (--AQD-QDD-DQD--)', function () {
  it('Should be found in (--AQD) at [2 - 4]', function (done) {
    let search = new StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 0) {
        assert.equal(o['isMatch'], true)
        assert.equal(o['start'], 2)
        assert.equal(o['end'], 4)
        assert.equal(o['data'].toString('ascii'), '--AQD')
        done()
      }
    })

    search.add('--AQD-QDD-DQD--')
    search.end()
  })

  it('Should return remaining data (-QDD-DQD--)', function (done) {
    let search = new StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 1) {
        assert.equal(o['isMatch'], false)
        assert.equal(o['start'], undefined)
        assert.equal(o['end'], undefined)
        assert.equal(o['data'].toString('ascii'), '-QDD-DQD--')
        done()
      }
    })

    search.add('--AQD-QDD-DQD--')
    search.end()
  })
})

describe('AQD in (AQD-AQD) with 1 limit', function () {
  it('Should be found in (AQD) at [0 - 2]', function (done) {
    let search = new StreamSearch('AQD', 1)
    let part = 0

    search.on('part', function (o) {
      if (part++ === 0) {
        assert.equal(o['isMatch'], true)
        assert.equal(o['start'], 0)
        assert.equal(o['end'], 2)
        assert.equal(o['data'].toString('ascii'), 'AQD')
        done()
      }
    })

    search.add('AQD-AQD')
    search.end()
  })

  it('Should return remaining data (-AQD)', function (done) {
    let search = new StreamSearch('AQD', 1)
    let part = 0

    search.on('part', function (o) {
      if (part++ === 1) {
        assert.equal(o['isMatch'], false)
        assert.equal(o['start'], undefined)
        assert.equal(o['end'], undefined)
        assert.equal(o['data'].toString('ascii'), '-AQD')
        done()
      }
    })

    search.add('AQD-AQD')
    search.end()
  })
})

describe('AQD in (AZXQAQ)', function () {
  it('Should not be found in (AZXQ)', function (done) {
    let search = new StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 0) {
        assert.equal(o['isMatch'], false)
        assert.equal(o['start'], undefined)
        assert.equal(o['end'], undefined)
        assert.equal(o['data'].toString('ascii'), 'AZXQ')
        done()
      }
    })

    search.add('AZXQAQ')
    search.end()
  })

  it('Should return remaining data (AQ)', function (done) {
    let search = new StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 1) {
        assert.equal(o['isMatch'], false)
        assert.equal(o['start'], undefined)
        assert.equal(o['end'], undefined)
        assert.equal(o['data'].toString('ascii'), 'AQ')
        done()
      }
    })

    search.add('AZXQAQ')
    search.end()
  })
})

describe('AQD in (ADAQDAQ)', function () {
  it('Should be found in (ADAQD) at [2 - 4]', function (done) {
    let search = new StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 0) {
        assert.equal(o['isMatch'], true)
        assert.equal(o['start'], 2)
        assert.equal(o['end'], 4)
        assert.equal(o['data'].toString('ascii'), 'ADAQD')
        done()
      }
    })

    search.add('ADAQDAQ')
    search.end()
  })

  it('Should return remaining data (AQ)', function (done) {
    let search = new StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 1) {
        assert.equal(o['isMatch'], false)
        assert.equal(o['start'], undefined)
        assert.equal(o['end'], undefined)
        assert.equal(o['data'].toString('ascii'), 'AQ')
        done()
      }
    })

    search.add('ADAQDAQ')
    search.end()
  })
})

describe('AQD in (-A, QD)', function () {
  it('Should not be found in (-)', function (done) {
    let search = new StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 0) {
        assert.equal(o['isMatch'], false)
        assert.equal(o['start'], undefined)
        assert.equal(o['end'], undefined)
        assert.equal(o['data'].toString('ascii'), '-')
        done()
      }
    })

    search.add('-A')
    search.add('QD')
    search.end()
  })

  it('Should be found in (AQD) at [0 - 2]', function (done) {
    let search = new StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 1) {
        assert.equal(o['isMatch'], true)
        assert.equal(o['start'], 0)
        assert.equal(o['end'], 2)
        assert.equal(o['data'].toString('ascii'), 'AQD')
        done()
      }
    })

    search.add('-A')
    search.add('QD')
    search.end()
  })
})

describe('AQD in (-A, Q, D)', function () {
  it('Should not be found in (-)', function (done) {
    let search = new StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 0) {
        assert.equal(o['isMatch'], false)
        assert.equal(o['start'], undefined)
        assert.equal(o['end'], undefined)
        assert.equal(o['data'].toString('ascii'), '-')
        done()
      }
    })

    search.add('-A')
    search.add('Q')
    search.add('D')
    search.end()
  })

  it('Should be found in (AQD) at [0 - 2]', function (done) {
    let search = new StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 1) {
        assert.equal(o['isMatch'], true)
        assert.equal(o['start'], 0)
        assert.equal(o['end'], 2)
        assert.equal(o['data'].toString('ascii'), 'AQD')
        done()
      }
    })

    search.add('-A')
    search.add('Q')
    search.add('D')
    search.end()
  })
})

describe('AQD in (A, QD--AQD)', function () {
  it('Should be found in (AQD) at [0 - 2]', function (done) {
    let search = new StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 0) {
        assert.equal(o['isMatch'], true)
        assert.equal(o['start'], 0)
        assert.equal(o['end'], 2)
        assert.equal(o['data'].toString('ascii'), 'AQD')
        done()
      }
    })

    search.add('A')
    search.add('QD--AQD')
    search.end()
  })

  it('Should be found in (--AQD) at [2 - 4]', function (done) {
    let search = new StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 1) {
        assert.equal(o['isMatch'], true)
        assert.equal(o['start'], 2)
        assert.equal(o['end'], 4)
        assert.equal(o['data'].toString('ascii'), '--AQD')
        done()
      }
    })

    search.add('A')
    search.add('QD--AQD')
    search.end()
  })
})

describe('AQD in (AQD-AQD)', function () {
  it('Should be found in (AQD) at [0 - 2]', function (done) {
    let search = new StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 0) {
        assert.equal(o['isMatch'], true)
        assert.equal(o['start'], 0)
        assert.equal(o['end'], 2)
        assert.equal(o['data'].toString('ascii'), 'AQD')
        done()
      }
    })

    search.add('AQD-AQD')
    search.end()
  })

  it('Should be found in (-AQD) at [1 - 3]', function (done) {
    let search = new StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 1) {
        assert.equal(o['isMatch'], true)
        assert.equal(o['start'], 1)
        assert.equal(o['end'], 3)
        assert.equal(o['data'].toString('ascii'), '-AQD')
        done()
      }
    })

    search.add('AQD-AQD')
    search.end()
  })
})

describe('AQD in (AQ, DQD)', function () {
  it('Should be found in (AQD) at [0 - 2]', function (done) {
    let search = new StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 0) {
        assert.equal(o['isMatch'], true)
        assert.equal(o['start'], 0)
        assert.equal(o['end'], 2)
        assert.equal(o['data'].toString('ascii'), 'AQD')
        done()
      }
    })

    search.add('AQ')
    search.add('DQD')
    search.end()
  })

  it('Should return remaining data (QD)', function (done) {
    let search = new StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 1) {
        assert.equal(o['isMatch'], false)
        assert.equal(o['start'], undefined)
        assert.equal(o['end'], undefined)
        assert.equal(o['data'].toString('ascii'), 'QD')
        done()
      }
    })

    search.add('AQ')
    search.add('DQD')
    search.end()
  })
})
