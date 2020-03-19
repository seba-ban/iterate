const {
  parallel,
  nested
} = require('./index')


const a = [1, 2, 3]
const b = [1, 2, 3]
const c = [1, 2, 3]

function* d() {
  for (let i = 1; i < 4; i++) yield i
}


const sleep = require('util').promisify(setTimeout)
async function* e() {
  for (let i = 0; i < 5; i++) {
    await sleep(500)
    yield i
  }
}

const iter = parallel(a, b, c, d())

// main()

// for (const i of iter)
//   console.log(i)
// for (const i of iter)
//   console.log(i)
// for (const i of nested(a, b, c, d, ))
//   console.log(i)



async function main() {
  for await (const i of a)
  console.log(i)
  // for await (const i of nested(a, d, e))
  //   console.log(i)
}


const fs = require('fs').promises

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

main()
async function main() {
  for await (const line of readLines('package-lock.json'))
  console.log(line.length)
}