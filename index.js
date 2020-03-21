const getHandlerFactory = require('./lib/get-proxy-handler')
const parallelGenerators = require('./lib/parallel')
const nestedGenerators = require('./lib/nested')

// return a proxy that will create an iterator when needed
// once iterator is created, it's set on the object ready to be reused
const parallel = (...args) => new Proxy({}, {
  get: getHandlerFactory(args, parallelGenerators)
})

const nested = (...args) => new Proxy({}, {
  get: getHandlerFactory(args, nestedGenerators)
})

module.exports = {
  parallel,
  nested
}