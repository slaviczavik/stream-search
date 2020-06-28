const toBuffer = function (input) {
  if (typeof input === 'string') {
    input = Buffer.from(input)
  }
  else if (!Buffer.isBuffer(input)) {
    input = Buffer.alloc(0)
  }

  return input
}

module.exports = { toBuffer }
