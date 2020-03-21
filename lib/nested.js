function* nestedIter(iterators) {
  const arr = [];

  yield* recursive(0);

  function* recursive(index) {
    const iterator = iterators[index]()
    for (const el of iterator) {
      arr[index] = el;
      if (iterators[index + 1])
        yield* recursive(index + 1)
      else yield arr.slice();
    }
  }
}

async function* nestedIterAsync(iterators) {
  let arr = [];

  yield* recursive(0);

  async function* recursive(index) {
    const iterator = iterators[index]()
    for await (const el of iterator) {
      arr[index] = el;
      if (iterators[index + 1])
        yield* recursive(index + 1)
      else yield arr.slice();
    }
  }
}

module.exports = {
  sync: nestedIter,
  async: nestedIterAsync
}