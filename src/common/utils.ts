export const sortAndPaginate = <T>(
  start: number,
  end: number,
  arr: T[],
  sortKey?: keyof T
): T[] => {
  if (!sortKey) return arr.slice(start, end);

  return arr
    .sort((a, b) => {
      const aElement = a[sortKey];
      const bElement = b[sortKey];

      if (aElement < bElement) return -1;
      if (aElement > bElement) return 1;
      return 0;
    })
    .slice(start, end);
};
