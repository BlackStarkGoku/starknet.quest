export const calculatePercentile = (rank: number, total: number): number => {
  if (total === rank) return 0;
  if (rank === 1) return 100;
  return parseInt((((total - rank) / total) * 100).toFixed(2));
};

export const numberWithCommas = (x: number) => {
  if (x === undefined) return "";
  return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
