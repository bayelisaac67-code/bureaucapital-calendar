import { useState } from 'react';
import { CLOSE_WARNING } from '../data/rejections.js';

export default function Modal({ title, stepLabel, progress, onClose, closable = true, warnOnClose = true, children, wide }) {
  const [confirmClose, setConfirmClose] = useState(false);

  const requestClose = () => {
    if (warnOnClose && !confirmClose) {
      setConfirmClose(true);
      return;
    }
    onClose();
  };

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && closable && requestClose()}>
      <div className={'modal' + (wide ? ' modal-wide' : '')}>
        <div className="modal-header">
          <div className="modal-titles">
            <span className="modal-seal">🏛️</span>
            <div>
              <h2>{title}</h2>
              {stepLabel && <div className="step-label">{stepLabel}</div>}
            </div>
          </div>
          {closable && (
            <button className="modal-close" onClick={requestClose} title="Abandon process">
              ✕
            </button>
          )}
        </div>
        {typeof progress === 'number' && (
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${Math.min(100, progress)}%` }} />
          </div>
        )}
        <div className="modal-body">{children}</div>

        {confirmClose && (
          <div className="confirm-close">
            <div className="confirm-close-card">
              <h3>⚠ Abandon Proceedings?</h3>
              <p>{CLOSE_WARNING}</p>
              <div className="btn-row">
                <button className="btn btn-secondary" onClick={() => setConfirmClose(false)}>
                  Return to Paperwork
                </button>
                <button className="btn btn-danger" onClick={onClose}>
                  Abandon (No Refunds)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
