import { useMemo } from 'react';
import { invoiceFor, fmt } from '../../data/fees.js';

export default function Invoice({ accessPrice, wallet, onPay }) {
  const invoice = useMemo(() => invoiceFor(accessPrice), [accessPrice]);
  const canAfford = wallet >= invoice.total;

  return (
    <div className="step">
      <div className="form-header">
        <div className="form-id">INV</div>
        <div>
          <h3 className="form-title">Official Invoice № {Math.floor(Math.random() * 900000 + 100000)}</h3>
          <div className="form-subtitle">BureauCapital™ Revenue Extraction Division · Net 0 (due immediately)</div>
        </div>
      </div>

      <table className="fee-table">
        <tbody>
          {invoice.items.map((item, i) => (
            <tr key={i}>
              <td>{item.label}</td>
              <td>{fmt(item.amount)}</td>
            </tr>
          ))}
          <tr className="fee-total">
            <td>Total Due</td>
            <td>{fmt(invoice.total)}</td>
          </tr>
        </tbody>
      </table>

      {!canAfford && (
        <div className="alert alert-error">
          <strong>Insufficient Bureaucracy.</strong> Your ledger holds {fmt(wallet)}. The Algorithm is disappointed.
        </div>
      )}

      <div className="btn-row">
        <button className="btn btn-primary" disabled={!canAfford} onClick={() => onPay(invoice.total)}>
          Pay Under Protest — {fmt(invoice.total)}
        </button>
      </div>
      <p className="fine-print">
        Disputes may be filed with the Department of Disputes, which disputes its own existence. All fees include a
        fee for including fees.
      </p>
    </div>
  );
}
