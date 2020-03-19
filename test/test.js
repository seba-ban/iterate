const {
  parallel,
  nested
} = require("../index");
const {
  readLines
} = require('./asyncGenerators')

const sleep = require('util').promisify(setTimeout)

main()

async function main() {
  const customParallel = parallel(
    readLines('./index.js'),
    readLines('./package.json'),
  )
  let line = 1;
  for await (const [index, package] of customParallel) {
    console.log(`Line ${line++}:`)
    console.log(`  ${index}`)
    console.log(`  ${package}`)
  }
}