const {
  parallel,
  nested
} = require("./index");

const a = [0, 1, 2];

const toIterate = Array(a.length).fill(a);

header(`Iterating over ${a.length} [${a.join(', ')}] arrays in parallel.`);
for (const next of parallel(...toIterate)) console.log(next);

header(`Iterating over ${a.length} [${a.join(', ')}] arrays in a nested way.`);
for (const next of nested(...toIterate)) console.log(next);

function header(str) {
  console.log(`\n${"=".repeat(50)}`);
  console.log(str);
  console.log(`${"=".repeat(50)}\n`);
}
