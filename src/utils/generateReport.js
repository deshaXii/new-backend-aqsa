export const generateReport = (repairs) => {
  const total = repairs.reduce((acc, r) => {
    const partsCost = r.parts?.reduce((sum, p) => sum + p.cost, 0) || 0;
    const profit = r.price - partsCost;
    acc.totalParts += partsCost;
    acc.totalProfit += profit;
    return acc;
  }, { totalParts: 0, totalProfit: 0 });

  return total;
};
