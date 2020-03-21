// main factory function for validators
module.exports = (symbol, customCheck = () => {}) => {
  return val => {
    try {
  
      if (val[symbol])
        return val[symbol].bind(val)

      const custom = customCheck(val)
      if (custom)
        return custom;

      throw new Error(`${String(val)} is not iterable (cannot read property ${String(symbol)})`)

    } catch (err) {
      throw new Error(`${String(val)} is not iterable (cannot read property ${String(symbol)})`)
    }
  }
}