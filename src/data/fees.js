// Pricing bureau — all figures are final, arbitrary, and non-negotiable.

export const STARTING_BALANCE = 10000;

export function daysAhead(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.round((target - today) / 86400000);
}

// Deterministic per-date "market volatility" so the price doesn't change on re-render.
function volatilityFor(date) {
  const seed = date.getFullYear() * 372 + date.getMonth() * 31 + date.getDate();
  const x = Math.sin(seed) * 10000;
  return (x - Math.floor(x)) * 0.25 + 0.02; // 2%–27%
}

export function priceForDate(date) {
  const ahead = daysAhead(date);
  if (ahead < 0) return null; // the past is non-refundable
  const base = ahead === 0 ? 0.5 : 2 * Math.pow(ahead, 1.15);
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const weekendSurcharge = isWeekend ? base * 0.4 : 0;
  const volatility = base * volatilityFor(date);
  const total = base + weekendSurcharge + volatility;
  return {
    base: round2(base),
    weekendSurcharge: round2(weekendSurcharge),
    volatility: round2(volatility),
    total: round2(total),
    isWeekend,
  };
}

export function invoiceFor(accessPrice) {
  const items = [
    { label: 'Base Access Fee (already paid, listed for morale)', amount: 0 },
    { label: 'Form A-17 Processing Fee', amount: 12.5 },
    { label: 'Form B-24 Processing Fee', amount: 12.5 },
    { label: 'Form C Processing Fee (Form Verification Surcharge)', amount: 17.75 },
    { label: 'Paper Depreciation', amount: 3.08 },
    { label: 'Stamp Amortization (Q3)', amount: 6.66 },
    { label: 'Convenience Fee (for our convenience)', amount: 9.99 },
    { label: 'Fee Assessment Fee', amount: 4.5 },
    { label: 'Ink Sustainability Levy', amount: 2.25 },
  ];
  const subtotal = items.reduce((s, i) => s + i.amount, 0);
  const gratuity = round2((subtotal + accessPrice) * 0.047);
  items.push({ label: 'Gratuity for the Algorithm (4.7%)', amount: gratuity });
  const total = round2(subtotal + gratuity);
  return { items, total };
}

export const FEES = {
  hardshipWaiver: 50,
  appeal: 25,
  amendment: 75,
  cancellation: 120,
  feeCancellation: 30,
};

export function round2(n) {
  return Math.round(n * 100) / 100;
}

export function fmt(n) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
