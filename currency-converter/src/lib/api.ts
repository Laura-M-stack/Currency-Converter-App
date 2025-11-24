export async function convertCurrency(
  from: string,
  to: string,
  amount: number
): Promise<{ result: number; rate: number }> {
  const res = await fetch(`https://open.er-api.com/v6/latest/${from}`);

  if (!res.ok) {
    throw new Error('Failed to fetch rates.');
  }

  const data = await res.json();

  if (data.result === 'error' || !data.rates) {
    throw new Error('Invalid response from rates API.');
  }

  const rate = data.rates[to];

  if (!rate) {
    throw new Error('Rate not found for target currency.');
  }

  return {
    result: amount * rate,
    rate,
  };
}
