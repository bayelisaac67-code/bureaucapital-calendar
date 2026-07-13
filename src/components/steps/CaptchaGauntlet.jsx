import { useState, useEffect } from 'react';

const GRID_EMOJI = ['📋', '🗄️', '📎', '🖊️', '📠', '🗃️', '📑', '🖇️', '🏛️'];
const TRIPLICATE_WORD = 'COMPLIANCE';

// Three sequential human-verification ordeals.
export default function CaptchaGauntlet({ challengeIndex, onPass }) {
  return (
    <div className="step step-center">
      <div className="captcha-header">
        <span className="captcha-logo">🤖🚫</span>
        <div>
          <h3>Human Verification — Challenge {challengeIndex + 1} of 3</h3>
          <div className="form-subtitle">reCRAPTCHA™ by BureauCapital Security Theater Division</div>
        </div>
      </div>
      {challengeIndex === 0 && <GridChallenge onPass={onPass} />}
      {challengeIndex === 1 && <TriplicateChallenge onPass={onPass} />}
      {challengeIndex === 2 && <DodgingCheckbox onPass={onPass} />}
    </div>
  );
}

function GridChallenge({ onPass }) {
  const [selected, setSelected] = useState(new Set());
  const [error, setError] = useState(null);

  const toggle = (i) => {
    setError(null);
    setSelected((s) => {
      const next = new Set(s);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const verify = () => {
    if (selected.size === GRID_EMOJI.length) {
      onPass();
    } else {
      setError('Incorrect. You missed some bureaucracy. It is in every square. It is everywhere.');
    }
  };

  return (
    <div className="captcha-box">
      <p className="captcha-prompt">Select all squares containing bureaucracy:</p>
      <div className="captcha-grid">
        {GRID_EMOJI.map((emoji, i) => (
          <button
            key={i}
            className={'captcha-cell' + (selected.has(i) ? ' captcha-cell-selected' : '')}
            onClick={() => toggle(i)}
          >
            {emoji}
          </button>
        ))}
      </div>
      {error && <div className="field-error-msg">✗ {error}</div>}
      <button className="btn btn-primary" onClick={verify}>
        Verify
      </button>
    </div>
  );
}

function TriplicateChallenge({ onPass }) {
  const [copies, setCopies] = useState(['', '', '']);
  const [error, setError] = useState(null);

  const verify = () => {
    if (copies.every((c) => c === TRIPLICATE_WORD)) {
      onPass();
    } else {
      setError(`All three copies must read exactly "${TRIPLICATE_WORD}" (case-sensitive, as is fate).`);
    }
  };

  return (
    <div className="captcha-box">
      <p className="captcha-prompt">
        Type the following word <strong>in triplicate</strong> (all copies must match, case-sensitive):
      </p>
      <div className="captcha-word">{TRIPLICATE_WORD}</div>
      {copies.map((c, i) => (
        <input
          key={i}
          type="text"
          className="captcha-input"
          placeholder={`Copy ${i + 1} of 3 (${['white', 'yellow', 'pink'][i]} copy)`}
          value={c}
          onChange={(e) => {
            setError(null);
            setCopies((prev) => prev.map((p, j) => (j === i ? e.target.value : p)));
          }}
        />
      ))}
      {error && <div className="field-error-msg">✗ {error}</div>}
      <button className="btn btn-primary" onClick={verify}>
        Verify Triplicate
      </button>
    </div>
  );
}

function DodgingCheckbox({ onPass }) {
  // The checkbox actively evades capture for 5 seconds. Persistence is the test.
  const EVASION_SECONDS = 5;
  const [secondsLeft, setSecondsLeft] = useState(EVASION_SECONDS);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [checked, setChecked] = useState(false);
  const evading = secondsLeft > 0;

  const jump = () =>
    setOffset({
      x: Math.floor(Math.random() * 240 - 120),
      y: Math.floor(Math.random() * 90 - 45),
    });

  useEffect(() => {
    if (!evading) {
      setOffset({ x: 0, y: 0 });
      return;
    }
    const countdown = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    const mover = setInterval(jump, 550);
    return () => {
      clearInterval(countdown);
      clearInterval(mover);
    };
  }, [evading]);

  return (
    <div className="captcha-box">
      <p className="captcha-prompt">Final verification. Simply check the box. Simply.</p>
      <div className="dodge-arena">
        <label
          className={'dodge-checkbox' + (evading ? ' dodge-evading' : '')}
          style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
          onMouseEnter={() => evading && jump()}
        >
          <input
            type="checkbox"
            checked={checked}
            disabled={evading}
            onChange={(e) => setChecked(e.target.checked)}
          />
          I am not a robot
        </label>
      </div>
      {evading && (
        <p className="fine-print">
          The checkbox is evading verification. It will tire in {secondsLeft} second{secondsLeft === 1 ? '' : 's'}.
        </p>
      )}
      {!evading && !checked && <p className="fine-print">The checkbox has grown tired. Claim it now.</p>}
      {checked && (
        <button className="btn btn-primary" onClick={onPass}>
          Confirm Humanity →
        </button>
      )}
    </div>
  );
}
