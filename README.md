An exercise to create simple functions to iterate over many iterables at once.

An `Object` with two functions is exported.

```js
const { parallel, nested } = require("./index");
```

* parallel(...args)
* nested(...args)

Both return an empty proxied object which will create generators for `Symbol.iterator` and `Symbol.asyncIterator` only when they are required, so they can be used in `for...of` and `for await...of` loops.

On each iteration an array will be yielded with current values for the iterables.

Any iterables and generators are allowed as args.

The `parallel` function is equivalent to something like this:

```js
for (let i = 0; i < longestArray.length; i++)
  const yielded = [
    arr1[i],
    arr2[i],
    arr3[i],
  ]
```

While `nested` is equivalent to:

```js
for (const el1 of iterable1)
  for (const el2 of iterable2)
    for (const el3 of iterable3)
      for (const el4 of iterable4)
        const yielded = [el1, el2, el3, el4]
```
Some examples:

```js
const a = [1, 42, 52];
const b = 'text';
const c = { name: "John", surname: "Doe" };
const d = new Set([10, 20]);

for (const [arrEl, char, entry, setEl] of parallel(a, b, Object.entries(c), d))
  console.log(arrEl, char, entry, setEl);

// 1 t [ 'name', 'John' ] 10
// 42 e [ 'surname', 'Doe' ] 20
// 52 x undefined undefined
// undefined t undefined undefined

const e = [0, 1];
const f = [2, 3];
const g = [4, 5];

for (const [fromE, fromF, fromG] of nested(e, f, g))
  console.log(fromE, fromF, fromG)

// 0 2 4
// 0 2 5
// 0 3 4
// 0 3 5
// 1 2 4
// 1 2 5
// 1 3 4
// 1 3 5
```

async:
```js
const sleep = require('util').promisify(setTimeout)

async function* a() {
  for (let i = 0; i < 3; i++) {
    await sleep(500)
    yield i
  }
}

async function* b() {
  for (let i = 3; i < 6; i++) {
    await sleep(500)
    yield i
  }
}

const iterable = nested(a, b)

main()
async function main() {
  for await (const el of iterable)
    console.log(el)
}

// [ 0, 3 ]
// [ 0, 4 ]
// [ 0, 5 ]
// [ 1, 3 ]
// [ 1, 4 ]
// [ 1, 5 ]
// [ 2, 3 ]
// [ 2, 4 ]
// [ 2, 5 ]
```

Difference between passing a generator directly and passing it's returned value:

```js
function* test() {
  yield 1
  yield 2
}

const iterator = parallel(test, test())

console.log('first run')

for (const el of iterator)
  console.log(el)

console.log('second run')

for (const el of iterator)
  console.log(el)

// first run
// [ 1, 1 ]
// [ 2, 2 ]
// second run
// [ 1, undefined ]
// [ 2, undefined ]
```

Node >=13.10 required for running tests.