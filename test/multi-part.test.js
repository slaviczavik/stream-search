const assert = require('assert')
const StreamSearch = require('../src/index.js')

describe('AQD in (AQD, FF)', function () {
  it('Should be found in (AQD) at [0 - 2]', function (done) {
    const search = StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 0) {
        assert.strictEqual(o.isMatch, true)
        assert.strictEqual(o.start, 0)
        assert.strictEqual(o.end, 2)
        assert.strictEqual(o.data.toString('ascii'), 'AQD')
        done()
      }
    })

    search.add('AQD')
    search.add('FF')
    search.end()
  })

  it('Should return remaining data (FF)', function (done) {
    const search = StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 1) {
        assert.strictEqual(o.isMatch, false)
        assert.strictEqual(o.start, undefined)
        assert.strictEqual(o.end, undefined)
        assert.strictEqual(o.data.toString('ascii'), 'FF')
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
    const search = StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 0) {
        assert.strictEqual(o.isMatch, true)
        assert.strictEqual(o.start, 0)
        assert.strictEqual(o.end, 2)
        assert.strictEqual(o.data.toString('ascii'), 'AQD')
        done()
      }
    })

    search.add('AQD--')
    search.end()
  })

  it('Should return remaining data (--)', function (done) {
    const search = StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 1) {
        assert.strictEqual(o.isMatch, false)
        assert.strictEqual(o.start, undefined)
        assert.strictEqual(o.end, undefined)
        assert.strictEqual(o.data.toString('ascii'), '--')
        done()
      }
    })

    search.add('AQD--')
    search.end()
  })
})

describe('AQD in (-, -AQD)', function () {
  it('Should not be found in (-)', function (done) {
    const search = StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 0) {
        assert.strictEqual(o.isMatch, false)
        assert.strictEqual(o.start, undefined)
        assert.strictEqual(o.end, undefined)
        assert.strictEqual(o.data.toString('ascii'), '-')
        done()
      }
    })

    search.add('-')
    search.add('-AQD')
    search.end()
  })

  it('Should be found in (-AQD) at [1 - 3]', function (done) {
    const search = StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 1) {
        assert.strictEqual(o.isMatch, true)
        assert.strictEqual(o.start, 1)
        assert.strictEqual(o.end, 3)
        assert.strictEqual(o.data.toString('ascii'), '-AQD')
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
    const search = StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 0) {
        assert.strictEqual(o.isMatch, true)
        assert.strictEqual(o.start, 2)
        assert.strictEqual(o.end, 4)
        assert.strictEqual(o.data.toString('ascii'), '--AQD')
        done()
      }
    })

    search.add('--AQD-QDD-DQD--')
    search.end()
  })

  it('Should return remaining data (-QDD-DQD--)', function (done) {
    const search = StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 1) {
        assert.strictEqual(o.isMatch, false)
        assert.strictEqual(o.start, undefined)
        assert.strictEqual(o.end, undefined)
        assert.strictEqual(o.data.toString('ascii'), '-QDD-DQD--')
        done()
      }
    })

    search.add('--AQD-QDD-DQD--')
    search.end()
  })
})

describe('AQD in (AQD-AQD) with 1 limit', function () {
  it('Should be found in (AQD) at [0 - 2]', function (done) {
    const search = StreamSearch('AQD', 1)
    let part = 0

    search.on('part', function (o) {
      if (part++ === 0) {
        assert.strictEqual(o.isMatch, true)
        assert.strictEqual(o.start, 0)
        assert.strictEqual(o.end, 2)
        assert.strictEqual(o.data.toString('ascii'), 'AQD')
        done()
      }
    })

    search.add('AQD-AQD')
    search.end()
  })

  it('Should return remaining data (-AQD)', function (done) {
    const search = StreamSearch('AQD', 1)
    let part = 0

    search.on('part', function (o) {
      if (part++ === 1) {
        assert.strictEqual(o.isMatch, false)
        assert.strictEqual(o.start, undefined)
        assert.strictEqual(o.end, undefined)
        assert.strictEqual(o.data.toString('ascii'), '-AQD')
        done()
      }
    })

    search.add('AQD-AQD')
    search.end()
  })
})

describe('AQD in (AZXQAQ)', function () {
  it('Should not be found in (AZXQ)', function (done) {
    const search = StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 0) {
        assert.strictEqual(o.isMatch, false)
        assert.strictEqual(o.start, undefined)
        assert.strictEqual(o.end, undefined)
        assert.strictEqual(o.data.toString('ascii'), 'AZXQ')
        done()
      }
    })

    search.add('AZXQAQ')
    search.end()
  })

  it('Should return remaining data (AQ)', function (done) {
    const search = StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 1) {
        assert.strictEqual(o.isMatch, false)
        assert.strictEqual(o.start, undefined)
        assert.strictEqual(o.end, undefined)
        assert.strictEqual(o.data.toString('ascii'), 'AQ')
        done()
      }
    })

    search.add('AZXQAQ')
    search.end()
  })
})

describe('AQD in (ADAQDAQ)', function () {
  it('Should be found in (ADAQD) at [2 - 4]', function (done) {
    const search = StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 0) {
        assert.strictEqual(o.isMatch, true)
        assert.strictEqual(o.start, 2)
        assert.strictEqual(o.end, 4)
        assert.strictEqual(o.data.toString('ascii'), 'ADAQD')
        done()
      }
    })

    search.add('ADAQDAQ')
    search.end()
  })

  it('Should return remaining data (AQ)', function (done) {
    const search = StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 1) {
        assert.strictEqual(o.isMatch, false)
        assert.strictEqual(o.start, undefined)
        assert.strictEqual(o.end, undefined)
        assert.strictEqual(o.data.toString('ascii'), 'AQ')
        done()
      }
    })

    search.add('ADAQDAQ')
    search.end()
  })
})

describe('AQD in (-A, QD)', function () {
  it('Should not be found in (-)', function (done) {
    const search = StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 0) {
        assert.strictEqual(o.isMatch, false)
        assert.strictEqual(o.start, undefined)
        assert.strictEqual(o.end, undefined)
        assert.strictEqual(o.data.toString('ascii'), '-')
        done()
      }
    })

    search.add('-A')
    search.add('QD')
    search.end()
  })

  it('Should be found in (AQD) at [0 - 2]', function (done) {
    const search = StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 1) {
        assert.strictEqual(o.isMatch, true)
        assert.strictEqual(o.start, 0)
        assert.strictEqual(o.end, 2)
        assert.strictEqual(o.data.toString('ascii'), 'AQD')
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
    const search = StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 0) {
        assert.strictEqual(o.isMatch, false)
        assert.strictEqual(o.start, undefined)
        assert.strictEqual(o.end, undefined)
        assert.strictEqual(o.data.toString('ascii'), '-')
        done()
      }
    })

    search.add('-A')
    search.add('Q')
    search.add('D')
    search.end()
  })

  it('Should be found in (AQD) at [0 - 2]', function (done) {
    const search = StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 1) {
        assert.strictEqual(o.isMatch, true)
        assert.strictEqual(o.start, 0)
        assert.strictEqual(o.end, 2)
        assert.strictEqual(o.data.toString('ascii'), 'AQD')
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
    const search = StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 0) {
        assert.strictEqual(o.isMatch, true)
        assert.strictEqual(o.start, 0)
        assert.strictEqual(o.end, 2)
        assert.strictEqual(o.data.toString('ascii'), 'AQD')
        done()
      }
    })

    search.add('A')
    search.add('QD--AQD')
    search.end()
  })

  it('Should be found in (--AQD) at [2 - 4]', function (done) {
    const search = StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 1) {
        assert.strictEqual(o.isMatch, true)
        assert.strictEqual(o.start, 2)
        assert.strictEqual(o.end, 4)
        assert.strictEqual(o.data.toString('ascii'), '--AQD')
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
    const search = StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 0) {
        assert.strictEqual(o.isMatch, true)
        assert.strictEqual(o.start, 0)
        assert.strictEqual(o.end, 2)
        assert.strictEqual(o.data.toString('ascii'), 'AQD')
        done()
      }
    })

    search.add('AQD-AQD')
    search.end()
  })

  it('Should be found in (-AQD) at [1 - 3]', function (done) {
    const search = StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 1) {
        assert.strictEqual(o.isMatch, true)
        assert.strictEqual(o.start, 1)
        assert.strictEqual(o.end, 3)
        assert.strictEqual(o.data.toString('ascii'), '-AQD')
        done()
      }
    })

    search.add('AQD-AQD')
    search.end()
  })
})

describe('AQD in (AQ, DQD)', function () {
  it('Should be found in (AQD) at [0 - 2]', function (done) {
    const search = StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 0) {
        assert.strictEqual(o.isMatch, true)
        assert.strictEqual(o.start, 0)
        assert.strictEqual(o.end, 2)
        assert.strictEqual(o.data.toString('ascii'), 'AQD')
        done()
      }
    })

    search.add('AQ')
    search.add('DQD')
    search.end()
  })

  it('Should return remaining data (QD)', function (done) {
    const search = StreamSearch('AQD')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 1) {
        assert.strictEqual(o.isMatch, false)
        assert.strictEqual(o.start, undefined)
        assert.strictEqual(o.end, undefined)
        assert.strictEqual(o.data.toString('ascii'), 'QD')
        done()
      }
    })

    search.add('AQ')
    search.add('DQD')
    search.end()
  })
})

describe('ANT in [ANT, FF]', function () {
  it('Should be found in ANT at [0 - 2]', function (done) {
    const search = StreamSearch('ANT')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 0) {
        assert.strictEqual(o.isMatch, true)
        assert.strictEqual(o.start, 0)
        assert.strictEqual(o.end, 2)
        assert.strictEqual(o.data.toString('ascii'), 'ANT')
        done()
      }
    })

    search.add('ANT')
    search.add('FF')
    search.end()
  })

  it('Should return remaining data FF', function (done) {
    const search = StreamSearch('ANT')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 1) {
        assert.strictEqual(o.isMatch, false)
        assert.strictEqual(o.start, undefined)
        assert.strictEqual(o.end, undefined)
        assert.strictEqual(o.data.toString('ascii'), 'FF')
        done()
      }
    })

    search.add('ANT')
    search.add('FF')
    search.end()
  })
})

describe('ANT in ANTELOPE', function () {
  it('Should be found in ANT at [0 - 2]', function (done) {
    const search = StreamSearch('ANT')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 0) {
        assert.strictEqual(o.isMatch, true)
        assert.strictEqual(o.start, 0)
        assert.strictEqual(o.end, 2)
        assert.strictEqual(o.data.toString('ascii'), 'ANT')
        done()
      }
    })

    search.add('ANTELOPE')
    search.end()
  })

  it('Should return remaining data ELOPE', function (done) {
    const search = StreamSearch('ANT')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 1) {
        assert.strictEqual(o.isMatch, false)
        assert.strictEqual(o.start, undefined)
        assert.strictEqual(o.end, undefined)
        assert.strictEqual(o.data.toString('ascii'), 'ELOPE')
        done()
      }
    })

    search.add('ANTELOPE')
    search.end()
  })
})

// describe('ANT in [I, CANT]', function () {
//   it('Should be found in ICANT at [2 - 4]', function (done) {
//     const search = StreamSearch('ANT')
//     let part = 0
//
//     search.on('part', function (o) {
//       if (part++ === 0) {
//         assert.strictEqual(o.isMatch, true)
//         assert.strictEqual(o.start, 2)
//         assert.strictEqual(o.end, 4)
//         assert.strictEqual(o.data.toString('ascii'), 'ICANT')
//         done()
//       }
//     })
//
//     search.add('I')
//     search.add('CANT')
//     search.end()
//   })
// })

describe('ANT in [--ANT-TREE-LEAF--]', function () {
  it('Should be found in --ANT at [2 - 4]', function (done) {
    const search = StreamSearch('ANT')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 0) {
        assert.strictEqual(o.isMatch, true)
        assert.strictEqual(o.start, 2)
        assert.strictEqual(o.end, 4)
        assert.strictEqual(o.data.toString('ascii'), '--ANT')
        done()
      }
    })

    search.add('--ANT-TREE-LEAF--')
    search.end()
  })

  it('Should return remaining data [-TREE-LEAF--]', function (done) {
    const search = StreamSearch('ANT')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 1) {
        assert.strictEqual(o.isMatch, false)
        assert.strictEqual(o.start, undefined)
        assert.strictEqual(o.end, undefined)
        assert.strictEqual(o.data.toString('ascii'), '-TREE-LEAF--')
        done()
      }
    })

    search.add('--ANT-TREE-LEAF--')
    search.end()
  })
})

describe('ANT in [ANT-ANT] with 1 limit', function () {
  it('Should be found in (ANT) at [0 - 2]', function (done) {
    const search = StreamSearch('ANT', 1)
    let part = 0

    search.on('part', function (o) {
      if (part++ === 0) {
        assert.strictEqual(o.isMatch, true)
        assert.strictEqual(o.start, 0)
        assert.strictEqual(o.end, 2)
        assert.strictEqual(o.data.toString('ascii'), 'ANT')
        done()
      }
    })

    search.add('ANT-ANT')
    search.end()
  })

  it('Should return remaining data [-ANT]', function (done) {
    const search = StreamSearch('ANT', 1)
    let part = 0

    search.on('part', function (o) {
      if (part++ === 1) {
        assert.strictEqual(o.isMatch, false)
        assert.strictEqual(o.start, undefined)
        assert.strictEqual(o.end, undefined)
        assert.strictEqual(o.data.toString('ascii'), '-ANT')
        done()
      }
    })

    search.add('ANT-ANT')
    search.end()
  })
})

describe('ANT in AZXQAN', function () {
  it('Should not be found in AZXQ', function (done) {
    const search = StreamSearch('ANT')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 0) {
        assert.strictEqual(o.isMatch, false)
        assert.strictEqual(o.start, undefined)
        assert.strictEqual(o.end, undefined)
        assert.strictEqual(o.data.toString('ascii'), 'AZXQ')
        done()
      }
    })

    search.add('AZXQAN')
    search.end()
  })

  it('Should return remaining data AN', function (done) {
    const search = StreamSearch('ANT')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 1) {
        assert.strictEqual(o.isMatch, false)
        assert.strictEqual(o.start, undefined)
        assert.strictEqual(o.end, undefined)
        assert.strictEqual(o.data.toString('ascii'), 'AN')
        done()
      }
    })

    search.add('AZXQAN')
    search.end()
  })
})

describe('ANT in ICANTFINDAN', function () {
  it('Should be found in ICANT at [2 - 4]', function (done) {
    const search = StreamSearch('ANT')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 0) {
        assert.strictEqual(o.isMatch, true)
        assert.strictEqual(o.start, 2)
        assert.strictEqual(o.end, 4)
        assert.strictEqual(o.data.toString('ascii'), 'ICANT')
        done()
      }
    })

    search.add('ICANTFINDAN')
    search.end()
  })

  it('Should not be found in FIND', function (done) {
    const search = StreamSearch('ANT')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 1) {
        assert.strictEqual(o.isMatch, false)
        assert.strictEqual(o.start, undefined)
        assert.strictEqual(o.end, undefined)
        assert.strictEqual(o.data.toString('ascii'), 'FIND')
        done()
      }
    })

    search.add('ICANTFINDAN')
    search.end()
  })

  it('Should return remaining data AN', function (done) {
    const search = StreamSearch('ANT')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 2) {
        assert.strictEqual(o.isMatch, false)
        assert.strictEqual(o.start, undefined)
        assert.strictEqual(o.end, undefined)
        assert.strictEqual(o.data.toString('ascii'), 'AN')
        done()
      }
    })

    search.add('ICANTFINDAN')
    search.end()
  })
})

// describe('ANT in [-A, NT]', function () {
//   it('Should not be found in -', function (done) {
//     const search = StreamSearch('ANT')
//     let part = 0
//
//     search.on('part', function (o) {
//
//       console.log(o)
//
//       if (part++ === 0) {
//         assert.strictEqual(o.isMatch, true)
//         assert.strictEqual(o.start, 1)
//         assert.strictEqual(o.end, 3)
//         assert.strictEqual(o.data.toString('ascii'), '-ANT')
//         done()
//       }
//     })
//
//     search.add('-A')
//     search.add('NT')
//     search.end()
//   })
// })

describe('ANT in [-A, N, T]', function () {
  it('Should not be found in -', function (done) {
    const search = StreamSearch('ANT')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 0) {
        assert.strictEqual(o.isMatch, false)
        assert.strictEqual(o.start, undefined)
        assert.strictEqual(o.end, undefined)
        assert.strictEqual(o.data.toString('ascii'), '-')
        done()
      }
    })

    search.add('-A')
    search.add('N')
    search.add('T')
    search.end()
  })

  it('Should be found in ANT at [0 - 2]', function (done) {
    const search = StreamSearch('ANT')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 1) {
        assert.strictEqual(o.isMatch, true)
        assert.strictEqual(o.start, 0)
        assert.strictEqual(o.end, 2)
        assert.strictEqual(o.data.toString('ascii'), 'ANT')
        done()
      }
    })

    search.add('-A')
    search.add('N')
    search.add('T')
    search.end()
  })
})

describe('ANT in [A, NT--ANT]', function () {
  it('Should be found in ANT at [0 - 2]', function (done) {
    const search = StreamSearch('ANT')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 0) {
        assert.strictEqual(o.isMatch, true)
        assert.strictEqual(o.start, 0)
        assert.strictEqual(o.end, 2)
        assert.strictEqual(o.data.toString('ascii'), 'ANT')
        done()
      }
    })

    search.add('A')
    search.add('NT--ANT')
    search.end()
  })

  it('Should be found in --ANT at [2 - 4]', function (done) {
    const search = StreamSearch('ANT')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 1) {
        assert.strictEqual(o.isMatch, true)
        assert.strictEqual(o.start, 2)
        assert.strictEqual(o.end, 4)
        assert.strictEqual(o.data.toString('ascii'), '--ANT')
        done()
      }
    })

    search.add('A')
    search.add('NT--ANT')
    search.end()
  })
})

describe('ANT in (ANT-ANT)', function () {
  it('Should be found in ANT at [0 - 2]', function (done) {
    const search = StreamSearch('ANT')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 0) {
        assert.strictEqual(o.isMatch, true)
        assert.strictEqual(o.start, 0)
        assert.strictEqual(o.end, 2)
        assert.strictEqual(o.data.toString('ascii'), 'ANT')
        done()
      }
    })

    search.add('ANT-ANT')
    search.end()
  })

  it('Should be found in -ANT at [1 - 3]', function (done) {
    const search = StreamSearch('ANT')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 1) {
        assert.strictEqual(o.isMatch, true)
        assert.strictEqual(o.start, 1)
        assert.strictEqual(o.end, 3)
        assert.strictEqual(o.data.toString('ascii'), '-ANT')
        done()
      }
    })

    search.add('ANT-ANT')
    search.end()
  })
})

describe('ANT in [AN, TEE]', function () {
  it('Should be found in ANT at [0 - 2]', function (done) {
    const search = StreamSearch('ANT')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 0) {
        assert.strictEqual(o.isMatch, true)
        assert.strictEqual(o.start, 0)
        assert.strictEqual(o.end, 2)
        assert.strictEqual(o.data.toString('ascii'), 'ANT')
        done()
      }
    })

    search.add('AN')
    search.add('TEE')
    search.end()
  })

  it('Should return remaining data EE', function (done) {
    const search = StreamSearch('ANT')
    let part = 0

    search.on('part', function (o) {
      if (part++ === 1) {
        assert.strictEqual(o.isMatch, false)
        assert.strictEqual(o.start, undefined)
        assert.strictEqual(o.end, undefined)
        assert.strictEqual(o.data.toString('ascii'), 'EE')
        done()
      }
    })

    search.add('ANT')
    search.add('EE')
    search.end()
  })
})
