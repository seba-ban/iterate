function parallel(...args) {
  checkIfAllIterable(args);

  return {
    *[Symbol.iterator]() {
      const iterators = args.map(arg => arg[Symbol.iterator]());
      while (true) {
        const next = iterators.map(el => el.next());
        if (next.every(el => el.done)) return;
        yield next.map(el => el.value);
      }
    }
  }
}

function nested(...args) {
  checkIfAllIterable(args);

  return {
    *[Symbol.iterator]() {

      yield* customIter(args[0], [], args.slice(1));

      function* customIter(iterable, currArr, remaining) {
        const ownIndex = currArr.length;
        for (const el of iterable) {
          currArr[ownIndex] = el;
          if (remaining.length > 0)
            yield* customIter(remaining[0], currArr.slice(), remaining.slice(1))
          else yield currArr;
        }
      }
    }
  }
}

function checkIfAllIterable(args) {
  for (const arg of args)
    if (!arg[Symbol.iterator])
      throw new TypeError(`${arg} is not iterable (cannot read property Symbol(Symbol.iterator))`);
}

module.exports = {
  parallel,
  nested
}