import { priceForDate, fmt, daysAhead } from '../data/fees.js';
import { toISO } from '../state.js';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function CalendarGrid({ viewDate, events, calendarUnlocked, onDateClick, onEventClick, onNavigate }) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayISO = toISO(new Date());

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  // Any visible date leaks the present via arithmetic. Redact everything.
  const monthIsClassified = !calendarUnlocked;

  return (
    <div className="calendar">
      <div className="calendar-nav">
        <button className="btn btn-nav" onClick={() => onNavigate(-1)} aria-label="Previous month">
          ◀
        </button>
        <h2 className="calendar-month">
          {monthIsClassified ? '█████████ ████' : `${MONTHS[month]} ${year}`}
        </h2>
        <button className="btn btn-nav" onClick={() => onNavigate(1)} aria-label="Next month">
          ▶
        </button>
      </div>

      <div className="calendar-grid">
        {WEEKDAYS.map((w) => (
          <div key={w} className="weekday">
            {w}
          </div>
        ))}
        {cells.map((date, i) => {
          if (!date) return <div key={'pad' + i} className="day day-pad" />;
          const iso = toISO(date);
          const ahead = daysAhead(date);
          const isPast = ahead < 0;
          const isToday = iso === todayISO;
          const price = priceForDate(date);
          const dayEvents = events.filter((e) => e.dateISO === iso);
          // Until the calendar is declassified, EVERY cell is a uniform state secret —
          // even the past, since visible past dates allow forbidden arithmetic.
          const isClassified = !calendarUnlocked;
          return (
            <div
              key={iso}
              className={
                isClassified
                  ? 'day day-future day-classified'
                  : 'day' + (isPast ? ' day-past' : ' day-future') + (isToday ? ' day-today' : '')
              }
              onClick={() => onDateClick(date)}
            >
              <div className="day-head">
                <span className="day-num">{isClassified ? '██' : date.getDate()}</span>
                {isClassified && <span className="lock-icon" title="Classified. Petition required.">🔒</span>}
                {isToday && !isClassified && <span className="today-badge">TODAY</span>}
              </div>
              {isClassified ? (
                <span className="day-price" title="Disclosure required before pricing may be perceived.">
                  [REDACTED]
                </span>
              ) : (
                !isPast &&
                price && (
                  <span className="day-price" title="Access fee. Non-negotiable. Weekend surcharge may apply.">
                    {fmt(price.total)}
                  </span>
                )
              )}
              <div className="day-events">
                {dayEvents.map((ev) =>
                  isClassified ? (
                    <button key={ev.id} className="event-chip chip-redacted" title="Event details classified.">
                      ██████
                    </button>
                  ) : (
                    <button
                      key={ev.id}
                      className="event-chip"
                      title={`Permit ${ev.permitNo}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(ev);
                      }}
                    >
                      {ev.title}
                    </button>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
