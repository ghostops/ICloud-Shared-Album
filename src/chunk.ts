// https://stackoverflow.com/a/11764168
export function chunk<T = any>(arr: T[], len: number) {
  let chunks = [],
      i = 0,
      n = arr.length;

  while (i < n) {
    chunks.push(arr.slice(i, i += len));
  }

  return chunks;
}