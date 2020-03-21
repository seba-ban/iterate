const {
  parallel,
  nested
} = require("../index");
const asyncHelpers = require('./async')
const rimraf = require('rimraf')


const assert = require('assert').strict


main()
  .then(run)

// some helper functions
const storeResultsFactory = (results) => {
  let index = 0;
  let genIndex = 0
  return iterable => {
    for (const el of iterable) {
      if (!results[index]) results[index] = []
      results[index][genIndex] = el
      index++
    }
    index = 0
    genIndex++
  }
}
const asyncToArray = async iterable => {
  const arr = [];
  for await (const el of iterable)
    arr.push(el)
  return arr
}

async function main() {

  const random = (min, max) => Math.floor(Math.random() * (max - min)) + min
  const min = 1
  const max = 10

  const files = await Promise.all(Array(5).fill(null).map(() => asyncHelpers.createRandomFile(random(min, max))))
  const [file1, file2, file3, file4, file5] = files;

  after('delete all temps', () => {
    for (const { folder } of files)
      rimraf(folder, err => {
        if (err) console.error(err)
      })
  })

  // ASYNC 
  describe('Testing async iterators', function () {

    describe('Testing parallel function', function () {

      it('correctly handles mixed iterables and generators', async function () {
        const results = []
        const storeResults = storeResultsFactory(results)

        const baseFiles = [file1, file2, file3]
        const iterables = baseFiles
          .map(f => new asyncHelpers.iterable(f.path))

        const baseForGenerators = [file4, file5]
        const generators = baseForGenerators
          .map(f => asyncHelpers.generator(f.path))

        baseFiles.forEach(f => storeResults(f.paragraphs))
        baseForGenerators.forEach(f => storeResults(f.paragraphs))

        for (let i = 0; i < results.length; i++)
          for (let j = 0; j < baseFiles.length + baseForGenerators.length; j++)
            if (results[i][j] === undefined) results[i][j] = undefined

        let i = 0;
        for await (const el of parallel(...iterables, ...generators)) {
          assert.deepStrictEqual(el, results[i])
          i++
        }

        assert.deepEqual(i, results.length)

      })

    })

    describe('Testing nested function', function () {

      it('correctly handles mixed iterables and generators', async function () {
        const [a, b, c] = files.slice(0, 3).map(f => new asyncHelpers.iterable(f.path))
        const [d, e] = files.slice(3).map(f => asyncHelpers.generator.bind(null, f.path))
        const fromNested = await asyncToArray(nested(a, b, c, d, e))

        let i = 0
        for await (const aEl of a)
          for await (const bEl of b)
            for await (const cEl of c)
              for await (const dEl of d())
                for await (const eEl of e())
                  assert.deepStrictEqual([aEl, bEl, cEl, dEl, eEl], fromNested[i++])

        assert.deepEqual(fromNested.length, i)

      })
    })
  })

  // SYNC 
  describe('Testing sync iterators', function () {
    // iterables
    const a = [1, 2, 3]
    const b = [3, 4, 5]
    const c = 'random text'
    // generators
    const d = function* () {
      for (let i = 0; i < d.length; i++)
        yield { index: i }
    }
    d.length = 2
    const e = function* () {
      for (let i = 0; i < e.length; i++)
        yield { index: String(i) }
    }
    e.length = 3

    describe('Testing parallel function', function () {

      it('correctly handles mixed iterables and generators', function () {

        const toCheck = [a, b, c, d, e]
        const fromParallel = Array.from(parallel(...toCheck))
        const results = []
        const storeResults = storeResultsFactory(results)

        storeResults(a)
        storeResults(b)
        storeResults(c)
        storeResults(d())
        storeResults(e())

        assert.deepStrictEqual(results.length, fromParallel.length)

        for (let i = 0; i < results; i++)
          assert.deepEqual(fromParallel[i], results[i])
      })

    })

    describe('Testing nested function', function () {

      it('correctly handles mixed iterables and generators', function () {

        const fromNested = Array.from(nested(a, b, c, d, e))
        let i = 0
        for (const aEl of a)
          for (const bEl of b)
            for (const cEl of c)
              for (const dEl of d())
                for (const eEl of e())
                  assert.deepStrictEqual([aEl, bEl, cEl, dEl, eEl], fromNested[i++])
        assert.deepEqual(fromNested.length, i)
      })
    })
  })
}



