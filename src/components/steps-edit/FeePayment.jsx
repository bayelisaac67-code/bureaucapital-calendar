import { fmt, round2 } from '../../data/fees.js';

// Generic "pay these arbitrary fees" step for amendments and cancellations.
export default function FeePayment({ title, items, wallet, onPay }) {
  const total = round2(items.reduce((s, i) => s + i.amount, 0));
  const canAfford = wallet >= total;
  return (
    <div className="step">
      <div className="form-header">
        <div className="form-id">FEE</div>
        <div>
          <h3 className="form-title">{title}</h3>
          <div className="form-subtitle">Revenue Extraction Division · All fees final, including this notice</div>
        </div>
      </div>
      <table className="fee-table">
        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              <td>{item.label}</td>
              <td>{fmt(item.amount)}</td>
            </tr>
          ))}
          <tr className="fee-total">
            <td>Total Due</td>
            <td>{fmt(total)}</td>
          </tr>
        </tbody>
      </table>
      {!canAfford && (
        <div className="alert alert-error">
          <strong>Insufficient Bureaucracy.</strong> Your ledger holds {fmt(wallet)}.
        </div>
      )}
      <div className="btn-row">
        <button className="btn btn-primary" disabled={!canAfford} onClick={() => onPay(total)}>
          Pay Under Protest — {fmt(total)}
        </button>
      </div>
    </div>
  );
}
