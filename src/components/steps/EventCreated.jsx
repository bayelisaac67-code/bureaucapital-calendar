export default function EventCreated({ event, onClose }) {
  return (
    <div className="step step-center certificate">
      <div className="confetti" aria-hidden="true">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="confetti-piece"
            style={{
              left: `${(i * 41) % 100}%`,
              animationDelay: `${(i % 8) * 0.18}s`,
              animationDuration: `${2 + (i % 5) * 0.4}s`,
            }}
          >
            {['🎊', '📋', '🎉', '📎'][i % 4]}
          </span>
        ))}
      </div>
      <div className="cert-seal">🏛️</div>
      <h3 className="cert-title">Certificate of Scheduled Existence</h3>
      <p className="cert-sub">The Bureau hereby permits the following occurrence:</p>
      <div className="cert-event">“{event.title}”</div>
      <div className="cert-date">{new Date(event.dateISO + 'T00:00:00').toDateString()}</div>
      <div className="cert-permit">Permit № {event.permitNo}</div>
      <p className="fine-print">
        This certificate certifies its own certification. Event enjoyment capped at{' '}
        {event.funLikelihood ?? 30}% per Form A-17. Frame it. Fear it. File it.
      </p>
      <button className="btn btn-primary" onClick={onClose}>
        Return to Calendar
      </button>
    </div>
  );
}
