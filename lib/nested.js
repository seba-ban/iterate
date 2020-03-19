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
async function* nestedIterAsyncTest(iterators) {
  let arr = [];

  yield* recursive(0);

  // WITH PROMISE ALL

  // async function* recursive(index) {
  //   const iterator = iterators[index]()

  //   while (true) {
  //     arr[index] = iterator.next()

  //     if (iterators[index + 1])
  //       yield* recursive(index + 1)
  //     else {
  //       arr = await Promise.all(arr)
  //       yield arr.map(next => next.value)
  //     };

  //   }

  // }

}

module.exports = {
  sync: nestedIter,
  async: nestedIterAsync
}