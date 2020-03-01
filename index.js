function iterate(...args) {
  for (const arg of args)
    if (!arg[Symbol.iterator])
      throw new Error(`${arg} is not iterable`);

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

module.exports = iterate;