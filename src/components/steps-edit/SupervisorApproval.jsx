import { useState, useEffect } from 'react';

const JANET_THINKING = [
  'Janet is at lunch…',
  'Janet has been located near the vending machine…',
  'Janet is reading your request…',
  'Janet sighed…',
  'Janet is consulting a laminated flowchart…',
];

// Janet, the supervisor, takes her time. First response is always a denial.
export default function SupervisorApproval({ onApproved }) {
  const [attempt, setAttempt] = useState(1);
  const [phase, setPhase] = useState('waiting'); // waiting | denied | approved
  const [statusIdx, setStatusIdx] = useState(0);

  useEffect(() => {
    if (phase !== 'waiting') return;
    setStatusIdx(0);
    const statusTimer = setInterval(() => setStatusIdx((i) => (i + 1) % JANET_THINKING.length), 2100);
    const decideTimer = setTimeout(() => {
      clearInterval(statusTimer);
      setPhase(attempt === 1 ? 'denied' : 'approved');
    }, attempt === 1 ? 10000 : 7000);
    return () => {
      clearInterval(statusTimer);
      clearTimeout(decideTimer);
    };
  }, [phase, attempt]);

  if (phase === 'denied') {
    return (
      <div className="step step-center">
        <div className="janet">👩‍💼</div>
        <div className="stamp stamp-rejected">DENIED</div>
        <h3>Supervisor Response Received</h3>
        <p className="rejection-reason">“Denied — resubmit with more sincerity. — Janet”</p>
        <button
          className="btn btn-primary"
          onClick={() => {
            setAttempt(2);
            setPhase('waiting');
          }}
        >
          Resubmit With More Sincerity 🙏
        </button>
      </div>
    );
  }

  if (phase === 'approved') {
    return (
      <div className="step step-center">
        <div className="janet">👩‍💼</div>
        <div className="stamp stamp-approved">APPROVED</div>
        <h3>Supervisor Approval Granted</h3>
        <p className="rejection-reason">“Fine. — Janet”</p>
        <button className="btn btn-primary" onClick={onApproved}>
          Continue →
        </button>
      </div>
    );
  }

  return (
    <div className="step step-center">
      <div className="janet janet-thinking">👩‍💼</div>
      <h3>Awaiting Supervisor Approval{attempt > 1 ? ' (Now With Sincerity)' : ''}</h3>
      <p className="processing-status">{JANET_THINKING[statusIdx]}</p>
      <div className="dots-loader">
        <span>●</span><span>●</span><span>●</span>
      </div>
      <p className="fine-print">Supervisor responses average 10 seconds or 10 business days, whichever hurts more.</p>
    </div>
  );
}
