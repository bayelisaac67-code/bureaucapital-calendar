import { useState } from 'react';

// Proof of 14-business-day advance notice. We have no record of your notice.
export default function AdvanceNotice({ onDone }) {
  const [checked, setChecked] = useState(false);
  const [rejectedOnce, setRejectedOnce] = useState(false);
  const [error, setError] = useState(null);

  const submit = () => {
    if (!checked) {
      setError('You must assert the notice you did not give.');
      return;
    }
    if (!rejectedOnce) {
      setRejectedOnce(true);
      setChecked(false);
      setError('We have no record of this notice. Please assert it again, but harder.');
      return;
    }
    onDone();
  };

  return (
    <div className="step">
      <div className="form-header">
        <div className="form-id">N-14</div>
        <div>
          <h3 className="form-title">Declaration of Advance Notice</h3>
          <div className="form-subtitle">Cancellations require 14 business days of advance notice, retroactively.</div>
        </div>
      </div>
      <p className="step-intro">
        Federal Scheduling Statute §404 (Not Found) requires that all cancellations be preceded by fourteen (14)
        business days of written notice, delivered by certified carrier pigeon or equivalent.
      </p>
      <div className={'field' + (error ? ' field-error' : '')}>
        <label className="radio-option">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => {
              setChecked(e.target.checked);
              setError(null);
            }}
          />
          I solemnly assert that I provided 14 business days of advance notice, in spirit if not in fact.
        </label>
        {error && <div className="field-error-msg">✗ {error}</div>}
      </div>
      <div className="btn-row">
        <button className="btn btn-primary" onClick={submit}>
          Submit Notice of Notice
        </button>
      </div>
    </div>
  );
}
