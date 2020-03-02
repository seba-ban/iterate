Simple functions to iterate over many iterables at once.

An `Object` with two functions is exported.

```js
const { parallel, nested } = require("./index");
```

* parallel(...args)
* nested(...args)

Both return an `Object` with a generator `Symbol.iterator` function, so it can be used in `for...of` loops.

In `for...of` loop, on each iteration an array will be yielded with current values for the iterables.

The `parallel` function is equivalent to something like this:

```js
for (const i = 0; i < longestArray.length; i++)
  const yielded = [
    arr1[i],
    arr2[i],
    arr3[i],
    ...
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