import { useState } from 'react';
import { priceForDate, fmt, FEES, daysAhead, round2 } from '../../data/fees.js';

export default function PurchaseAccess({ date, wallet, onPay }) {
  const [waivers, setWaivers] = useState(0);
  const price = priceForDate(date);
  const total = round2(price.total + waivers * FEES.hardshipWaiver);
  const canAfford = wallet >= total;
  const ahead = daysAhead(date);

  return (
    <div className="step">
      <p className="step-intro">
        You have selected <strong>{date.toDateString()}</strong>
        {ahead === 0 ? ' (today — a bargain, relatively)' : `, which is ${ahead} day${ahead === 1 ? '' : 's'} into the future`}.
        Future access is a <em>premium temporal product</em> and must be purchased before scheduling may be contemplated.
      </p>

      <table className="fee-table">
        <tbody>
          <tr>
            <td>Temporal Access Fee ({ahead} day{ahead === 1 ? '' : 's'} ahead)</td>
            <td>{fmt(price.base)}</td>
          </tr>
          {price.weekendSurcharge > 0 && (
            <tr>
              <td>Weekend Surcharge — Premium Leisure Zone (+40%)</td>
              <td>{fmt(price.weekendSurcharge)}</td>
            </tr>
          )}
          <tr>
            <td>Market Volatility Adjustment (the market felt something)</td>
            <td>{fmt(price.volatility)}</td>
          </tr>
          {Array.from({ length: waivers }).map((_, i) => (
            <tr key={i} className="fee-penalty">
              <td>Hardship Waiver Processing Fee #{i + 1}</td>
              <td>{fmt(FEES.hardshipWaiver)}</td>
            </tr>
          ))}
          <tr className="fee-total">
            <td>Total Due Now</td>
            <td>{fmt(total)}</td>
          </tr>
        </tbody>
      </table>

      {!canAfford && (
        <div className="alert alert-error">
          <strong>Insufficient Bureaucracy.</strong> Please accumulate more compliance. Your ledger holds only{' '}
          {fmt(wallet)}.
        </div>
      )}

      <div className="btn-row">
        <button
          className="btn btn-secondary"
          onClick={() => setWaivers((w) => w + 1)}
          title="This will not help."
        >
          Request Hardship Waiver (+{fmt(FEES.hardshipWaiver)} processing fee)
        </button>
        <button className="btn btn-primary" disabled={!canAfford} onClick={() => onPay(total)}>
          Purchase Access — {fmt(total)}
        </button>
      </div>
      <p className="fine-print">
        By purchasing, you agree that time is a construct and refunds are a myth. BureauCapital™ is not liable for
        the passage of time, the quality of the day purchased, or weather (emotional or meteorological).
      </p>
    </div>
  );
}
