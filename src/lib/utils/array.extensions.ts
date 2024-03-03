declare global {
  interface Array<T> {
    chunk(size: number): Array<Array<T>>;
  }
}

Array.prototype.chunk = function <T>(size: number): T[][] {
  const length = Math.ceil(this.length / size);
  const chunks = new Array(length).fill(0);
  return chunks.map((_, index) => {
    const start = index * size;
    const end = (index + 1) * size;
    return this.slice(start, end);
  });
};

export {};
