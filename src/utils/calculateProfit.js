export const calculateProfit = (repairPrice, parts) => {
  const totalPartsCost = parts.reduce((sum, p) => sum + p.cost, 0);
  const profit = repairPrice - totalPartsCost;
  return { totalPartsCost, profit };
};
