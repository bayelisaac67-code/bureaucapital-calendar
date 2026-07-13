import { fmt } from '../data/fees.js';

export default function Wallet({ balance }) {
  return (
    <div className="wallet" title="Converted from BureauBucks™ at an official rate of exactly 1:1.">
      <span className="wallet-label">Citizen Ledger</span>
      <span className={'wallet-balance' + (balance < 100 ? ' wallet-low' : '')}>{fmt(balance)}</span>
      <span className="wallet-currency">USD · converted from BureauBucks™ (rate: 1:1)</span>
    </div>
  );
}
