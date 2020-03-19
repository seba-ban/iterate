const fs = require('fs').promises

// yields each line in a file
async function* readLines(file, {
  enc = 'utf8',
  sizeToRead = 256,
  split = '\n',
  removeSplit = true
} = {}) {

  const splitLength = split.length;

  const fd = await fs.open(file, 'r')
  let line = ''
  const buf = Buffer.alloc(sizeToRead)

  while (true) {
    const {
      bytesRead
    } = await fd.read(buf, 0, sizeToRead, null)
    if (!bytesRead) {
      if (line) yield line
      break;
    }

    let string = buf.toString(enc, 0, bytesRead);
    let lastIndex = 0;

    while (true) {
      const index = string.indexOf(split, lastIndex)
      if (index === -1) {
        line += string.substring(lastIndex)
        break
      }
      line += string.substring(lastIndex, removeSplit ? index : index + splitLength)
      lastIndex = index + splitLength
      yield line
      line = ''
    }

  }
  await fd.close()
}

module.exports = {
  readLines
}