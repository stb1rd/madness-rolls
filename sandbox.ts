const q = [
  ...new Map([
    [1, ['c']],
    [2, ['b', 'd']],
  ]),
].sort((a, b) => (a[1].length > b[1].length ? -1 : a[1].length < b[1].length ? 1 : 0));

console.log(q);
