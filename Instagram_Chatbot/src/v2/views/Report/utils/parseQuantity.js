export const CURRENCY_UNITS = [
  { value: 1_0000_0000_0000, symbol: '兆' },
  { value: 1_0000_0000, symbol: '億' },
  { value: 1_0000, symbol: '万' },
];

export const parseQuantity = (quantity = 0) => {
  for (const { value, symbol } of CURRENCY_UNITS) {
    if (quantity >= value) {
      return (
        (quantity / value).toFixed(1).replace(/\.0$/, '') + symbol
      );
    }
  }
  return (quantity || 0).toLocaleString('ja-JP');
};
