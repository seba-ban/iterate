const{ getAllIterators, getAsyncIterator, getIterator} = require('./get-iterators')

// get handler for the proxy we're returning from the main functions
module.exports = (args, {
  sync,
  async
}) => {
  let iterators;
  return (target, prop) => {
    if (prop in target)
      return target[prop]
    switch (prop) {
      case Symbol.iterator:
        iterators = getAllIterators(args, getIterator)
        target[Symbol.iterator] = sync.bind(null, iterators)
        return target[Symbol.iterator];
      case Symbol.asyncIterator:
        iterators = getAllIterators(args, getAsyncIterator)
        target[Symbol.asyncIterator] = async.bind(null, iterators)
        return target[Symbol.asyncIterator];
      default:
        return false;
    }
  }
}