function* parallelIter(iterators) {
  iterators = iterators.map(el => el())
  while (true) {
    const next = iterators.map(el => el.next());
    if (next.every(el => el.done)) return;
    yield next.map(el => el.value);
  }
}

async function* parallelIterAsync(iterators) {
  iterators = iterators.map(el => el())
  while (true) {
    const next = await Promise.all(
      iterators.map(el => el.next())
    );
    if (next.every(el => el.done)) return;
    yield next.map(el => el.value);
  }
}

module.exports = {
  sync: parallelIter, 
  async: parallelIterAsync
}