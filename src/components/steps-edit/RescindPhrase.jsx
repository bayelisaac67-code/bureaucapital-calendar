import { useState } from 'react';

const PHRASE = 'I HEREBY RESCIND MY FUN';

// Final deletion confirmation: type the sacred phrase, exactly.
export default function RescindPhrase({ eventTitle, onConfirm }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(null);

  const submit = () => {
    if (value !== PHRASE) {
      setError(
        value.trim().toUpperCase() === PHRASE
          ? 'Close, but your rescission lacks precision. Match the phrase exactly.'
          : 'Incorrect incantation. Fun remains legally binding.'
      );
      return;
    }
    onConfirm();
  };

  return (
    <div className="step step-center">
      <div className="stamp stamp-rejected" style={{ fontSize: '1.1rem' }}>FINAL WARNING</div>
      <h3>Rescission of Fun</h3>
      <p className="step-intro">
        To permanently cancel <strong>“{eventTitle}”</strong>, type the official phrase below, in full, while
        maintaining eye contact with your monitor:
      </p>
      <div className="captcha-word">{PHRASE}</div>
      <input
        type="text"
        className="captcha-input"
        placeholder="Type the phrase of rescission…"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setError(null);
        }}
      />
      {error && <div className="field-error-msg">✗ {error}</div>}
      <div className="btn-row">
        <button className="btn btn-danger" onClick={submit}>
          Rescind Fun Permanently
        </button>
      </div>
      <p className="fine-print">Rescinded fun cannot be un-rescinded without Form UN-DO, discontinued in 1994.</p>
    </div>
  );
}
