export async function convertCurrency(
  from: string,
  to: string,
  amount: number
): Promise<{ result: number; rate: number }> {
  const res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
  const data = await res.json();

  const rate = data.rates[to];
  if (!rate) {
    throw new Error('Rate not found for target currency.');
  }

  return {
    result: amount * rate,
    rate,
  };
}
