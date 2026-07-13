import { useState, useEffect, useRef } from 'react';
import { PROCESSING_STATUSES, REJECTION_REASONS, pick } from '../../data/rejections.js';
import { FEES, fmt } from '../../data/fees.js';

// Fake "5 business day" approval, compressed to ~18 real seconds.
// First attempt has a 35% rejection chance; appeals ($25) always succeed.
export default function ApprovalProcess({ wallet, onApproved, onSpend }) {
  const [attempt, setAttempt] = useState(1);
  const [phase, setPhase] = useState('processing'); // processing | rejected | approved
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(PROCESSING_STATUSES[0]);
  const [rejection, setRejection] = useState(null);
  const [businessDays, setBusinessDays] = useState(5);
  const willReject = useRef(Math.random() < 0.35);

  useEffect(() => {
    if (phase !== 'processing') return;
    let p = 0;
    let tick = 0;
    const statusInterval = setInterval(() => {
      setStatus(PROCESSING_STATUSES[Math.floor(Math.random() * PROCESSING_STATUSES.length)]);
    }, 1800);
    const progressInterval = setInterval(() => {
      tick++;
      // Erratic progress: mostly forward, occasionally backwards, stalls near 99.
      if (p >= 99 && tick % 4 !== 0) {
        // stall at 99%
      } else if (Math.random() < 0.15 && p > 10) {
        p = Math.max(5, p - Math.floor(Math.random() * 12 + 3));
        setStatus('Recalculating… (progress was misfiled)');
      } else {
        p = Math.min(99, p + Math.random() * 9 + 2);
      }
      setProgress(p);
      setBusinessDays(Math.max(0, Math.round(5 - (p / 100) * 5)));
      if (tick >= 22) {
        clearInterval(progressInterval);
        clearInterval(statusInterval);
        setProgress(100);
        if (attempt === 1 && willReject.current) {
          setRejection(pick(REJECTION_REASONS));
          setPhase('rejected');
        } else {
          setPhase('approved');
        }
      }
    }, 800);
    return () => {
      clearInterval(statusInterval);
      clearInterval(progressInterval);
    };
  }, [phase, attempt]);

  if (phase === 'rejected') {
    return (
      <div className="step step-center">
        <div className="stamp stamp-rejected">REJECTED</div>
        <h3>Application Rejected</h3>
        <p className="rejection-reason">Official reason: “{rejection}”</p>
        <p className="fine-print">
          Rejection code 40-B. You may appeal this decision for a modest, mandatory fee. Appeals are reviewed by the
          same person, in a slightly better mood.
        </p>
        <button
          className="btn btn-primary"
          disabled={wallet < FEES.appeal}
          onClick={() => {
            onSpend(FEES.appeal, 'Appeal Fee');
            setAttempt(2);
            setProgress(0);
            setPhase('processing');
          }}
        >
          File Appeal — {fmt(FEES.appeal)}
        </button>
        {wallet < FEES.appeal && (
          <p className="field-error-msg">Insufficient Bureaucracy. You cannot even afford to complain.</p>
        )}
      </div>
    );
  }

  if (phase === 'approved') {
    return (
      <div className="step step-center">
        <div className="stamp stamp-approved">APPROVED</div>
        <h3>Application Approved{attempt > 1 ? ' (Upon Appeal)' : ''}</h3>
        <p>
          Your request has been deemed <em>adequately bureaucratic</em>. Proceed to invoicing, where the real fees
          live.
        </p>
        <button className="btn btn-primary" onClick={onApproved}>
          Proceed to Invoice →
        </button>
      </div>
    );
  }

  return (
    <div className="step step-center">
      <div className="spinner" aria-hidden="true">🗄️</div>
      <h3>Processing Application{attempt > 1 ? ' (Appeal)' : ''}…</h3>
      <p className="processing-status">{status}</p>
      <div className="progress-track progress-big">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <p className="fine-print">
        Estimated wait: <strong>{businessDays} business day{businessDays === 1 ? '' : 's'}</strong> (compressed for
        your convenience; convenience fee already applied)
      </p>
    </div>
  );
}
