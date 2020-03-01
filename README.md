Simple function to iterate over many iterables at once in parallel.

# iterate(...args)
Returns an `Object` with a generator `Symbol.iterator` function, so it can be used in `for...of` loops.

In `for...of` loop, on each iteration an array will be yielded with current values for the iterables.

```js
const a = [1, 42, 52];
const b = 'text';
const c = { name: "John", surname: "Doe" };
const d = new Set([10, 20]);

for (const [arrEl, char, entry, setEl] of iterate(a, b, Object.entries(c), d))
  console.log(arrEl, char, entry, setEl);

// 1 t [ 'name', 'John' ] 10
// 42 e [ 'surname', 'Doe' ] 20
// 52 x undefined undefined
// undefined t undefined undefined
```