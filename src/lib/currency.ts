export function formatCurrency(amount: number): string {
  // Automatic currency detection based on amount
  // If amount is less than 10,000, we assume it is USD.
  // Otherwise, we assume it is UZS.
  if (amount >= 10000) {
    return new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', minimumFractionDigits: 0 }).format(amount);
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}
