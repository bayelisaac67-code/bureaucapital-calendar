import { useState, useEffect } from 'react';
import { ADS } from '../../data/ads.js';

// One unskippable parody ad. The Skip button exists, is tiny, disabled,
// and flees the cursor — as is tradition.
export default function AdGauntlet({ adIndex, onDone }) {
  const ad = ADS[adIndex];
  const [remaining, setRemaining] = useState(ad.duration);
  const [skipOffset, setSkipOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setRemaining(ad.duration);
    setSkipOffset({ x: 0, y: 0 });
  }, [adIndex, ad.duration]);

  useEffect(() => {
    if (remaining <= 0) return;
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining]);

  const dodgeSkip = () => {
    setSkipOffset({
      x: Math.floor(Math.random() * 160 - 80),
      y: Math.floor(Math.random() * 60 - 30),
    });
  };

  return (
    <div className={'step step-center ad ' + ad.theme}>
      <div className="ad-badge">ADVERTISEMENT {adIndex + 1} OF {ADS.length} — MANDATORY VIEWING</div>
      <div className="ad-emoji">{ad.emoji}</div>
      <h3 className="ad-brand">{ad.brand}</h3>
      <p className="ad-tagline">{ad.tagline}</p>
      <p className="ad-body">{ad.body}</p>
      <p className="ad-disclaimer">{ad.disclaimer}</p>

      <div className="ad-controls">
        {remaining > 0 ? (
          <>
            <div className="ad-countdown">
              You may continue existing in <strong>{remaining}</strong>s
            </div>
            <button
              className="btn btn-skip"
              disabled
              onMouseEnter={dodgeSkip}
              style={{ transform: `translate(${skipOffset.x}px, ${skipOffset.y}px)` }}
              title="This button is decorative."
            >
              Skip Ad
            </button>
          </>
        ) : (
          <button className="btn btn-primary" onClick={onDone}>
            {adIndex < ADS.length - 1 ? 'Continue to Next Mandatory Advertisement →' : 'Proceed to Human Verification →'}
          </button>
        )}
      </div>
    </div>
  );
}
