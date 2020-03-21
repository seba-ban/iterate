const split = require('split2')
const { promises: fs, createWriteStream, createReadStream } = require('fs')
const { promisify } = require('util')
const { join } = require('path')
const os = require('os')
const { pipeline, Readable } = require('stream')
const pump = promisify(pipeline)
const chance = new require('chance')()

async function createRandomFile(paragraphNumber = 100) {
  const folder = await fs.mkdtemp(join(os.tmpdir(), 'generator-test-'))
  const path = join(folder, 'random-text')
  const paragraphs = []
  let characters = 0

  function* getParagraphs() {
    for (let i = 0; i < paragraphNumber; i++)
      yield chance.paragraph()
  }
  async function* passthrough(source) {
    for await (const p of source) {
      paragraphs.push(p)
      characters += p.length
      yield p + '\n'
    }
  }

  await pump(
    Readable.from(getParagraphs()),
    passthrough,
    createWriteStream(path)
  )

  return {
    paragraphs,
    path,
    characters,
    folder
  }
}

async function* getLines(pathToFile) {
  const lines = split()
  pipeline(
    createReadStream(pathToFile),
    lines,
    err => {
      if (err) throw err
    }
  )

  for await (const line of lines) {
    yield line
  }
}

class File {
  constructor(path) {
    this.path = path;
    this[Symbol.asyncIterator] = getLines.bind(null, this.path)
  }
}

module.exports = {
  generator: getLines,
  iterable: File,
  createRandomFile
}