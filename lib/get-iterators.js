const factory = require('./get-symbol-factory')

// helper function for finding generators
const checkForGenerator = tag => {
  return val => {
    if (val[Symbol.toStringTag] === tag)
      return val
    return false;
  }
}

// this will be our validators for the getAllIterators fn
const getIterator = factory(Symbol.iterator, checkForGenerator('GeneratorFunction'))
const _getAsyncIterator = factory(Symbol.asyncIterator, checkForGenerator('AsyncGeneratorFunction'))
// for async we'll accept both async and sync iterators
const getAsyncIterator = val => {
  try {
    return _getAsyncIterator(val)
  } catch (err) {
    return getIterator(val)
  }
}

// maps given arguments to their iterators
const getAllIterators = (args, validator) =>
  args.map(el => {
    const iterator = validator(el)
    return iterator
  })

module.exports = {
  getAsyncIterator,
  getIterator,
  getAllIterators
}