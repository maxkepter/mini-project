/* eslint-disable @typescript-eslint/no-unsafe-assignment */
function swap(arr: any[], i: number, j: number): void {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

function shuffleArray<T>(array: T[]): T[] {
  const len = array.length;
  for (let i = len - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    swap(array, i, j);
  }
  return array;
}

export { swap, shuffleArray };
