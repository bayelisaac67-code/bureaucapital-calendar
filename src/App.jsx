import { useState, useCallback } from 'react';
import { useBureauState, toISO, permitNumber } from './state.js';
import { priceForDate, daysAhead, FEES, fmt } from './data/fees.js';
import { CREATE_FORMS, EDIT_FORM, DELETE_FORM, TODAY_FORM } from './data/forms.js';
import { INTERSTITIAL_ERRORS, PAST_DATE_ERROR, pick } from './data/rejections.js';

import CalendarGrid from './components/CalendarGrid.jsx';
import Wallet from './components/Wallet.jsx';
import Modal from './components/Modal.jsx';
import PurchaseAccess from './components/steps/PurchaseAccess.jsx';
import FormWizard from './components/steps/FormWizard.jsx';
import ApprovalProcess from './components/steps/ApprovalProcess.jsx';
import Invoice from './components/steps/Invoice.jsx';
import AdGauntlet from './components/steps/AdGauntlet.jsx';
import CaptchaGauntlet from './components/steps/CaptchaGauntlet.jsx';
import EventCreated from './components/steps/EventCreated.jsx';
import SupervisorApproval from './components/steps-edit/SupervisorApproval.jsx';
import AdvanceNotice from './components/steps-edit/AdvanceNotice.jsx';
import FeePayment from './components/steps-edit/FeePayment.jsx';
import RescindPhrase from './components/steps-edit/RescindPhrase.jsx';

const CREATE_STEPS = [
  'purchase',
  'form:0', 'form:1', 'form:2',
  'approval',
  'invoice',
  'ad:0', 'ad:1', 'ad:2',
  'captcha:0', 'captcha:1', 'captcha:2',
  'done',
];
const EDIT_STEPS = ['form-edit', 'fee-edit', 'supervisor', 'done-edit'];
const UNLOCK_STEPS = ['petition', 'unlock-fee', 'unlock-done'];
const DELETE_STEPS = ['form-delete', 'notice', 'fee-delete', 'rescind', 'done-delete'];

const STEP_TITLES = {
  purchase: 'Temporal Access Purchase',
  'form:0': 'Form A-17',
  'form:1': 'Form B-24',
  'form:2': 'Form C',
  approval: 'Application Review',
  invoice: 'Invoicing',
  'ad:0': 'A Word From Our Sponsors',
  'ad:1': 'Another Word From Our Sponsors',
  'ad:2': 'A Final, Mandatory Word',
  'captcha:0': 'Human Verification',
  'captcha:1': 'Human Verification, Continued',
  'captcha:2': 'Human Verification, Concluded',
  done: 'Event Certification',
  petition: 'Petition to Acknowledge the Present',
  'unlock-fee': 'Disclosure Fees',
  'unlock-done': 'Declassification Certificate',
  'form-edit': 'Amendment Request',
  'fee-edit': 'Amendment Fees',
  supervisor: 'Supervisor Approval',
  'done-edit': 'Amendment Certified',
  'form-delete': 'Cancellation Request',
  notice: 'Advance Notice Verification',
  'fee-delete': 'Cancellation Fees',
  rescind: 'Final Rescission',
  'done-delete': 'Cancellation Complete',
};

function progressJoke(frac) {
  if (frac < 0.25) return "you're almost nowhere";
  if (frac < 0.5) return 'progress is a state of mind';
  if (frac < 0.75) return 'the end is theoretically real';
  if (frac < 1) return 'dangerously close to success';
  return 'somehow, it is over';
}

export default function App() {
  const [state, dispatch] = useBureauState();
  const [viewDate, setViewDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [flow, setFlow] = useState(null); // { mode, steps, stepIndex, date, data, event }
  const [detailEvent, setDetailEvent] = useState(null);
  const [toast, setToast] = useState(null);
  const [interstitial, setInterstitial] = useState(null); // { msg, resume: fn }

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4200);
  }, []);

  const spend = useCallback((amount) => dispatch({ type: 'SPEND', amount }), [dispatch]);

  // Advance the flow one step — with a ~10% chance the calendar is at lunch.
  const advance = useCallback((patch = {}) => {
    const doIt = () =>
      setFlow((f) => {
        if (!f) return f;
        return { ...f, stepIndex: f.stepIndex + 1, data: { ...f.data, ...patch } };
      });
    if (Math.random() < 0.1) {
      setInterstitial({ msg: pick(INTERSTITIAL_ERRORS), resume: doIt });
    } else {
      doIt();
    }
  }, []);

  const closeFlow = useCallback(() => setFlow(null), []);

  const calendarUnlocked = state.todayUnlockISO === toISO(new Date());

  const startCreate = (date) => {
    if (!calendarUnlocked) {
      // The calendar is classified. One does not simply perceive dates.
      setFlow({ mode: 'unlock', steps: UNLOCK_STEPS, stepIndex: 0, date, data: {} });
      return;
    }
    if (daysAhead(date) < 0) {
      showToast(PAST_DATE_ERROR);
      return;
    }
    setFlow({ mode: 'create', steps: CREATE_STEPS, stepIndex: 0, date, data: {} });
  };

  const startEdit = (event) => {
    setDetailEvent(null);
    setFlow({ mode: 'edit', steps: EDIT_STEPS, stepIndex: 0, event, data: {} });
  };

  const startDelete = (event) => {
    setDetailEvent(null);
    setFlow({ mode: 'delete', steps: DELETE_STEPS, stepIndex: 0, event, data: {} });
  };

  const step = flow ? flow.steps[flow.stepIndex] : null;
  const frac = flow ? (flow.stepIndex + 1) / flow.steps.length : 0;
  const isDoneStep = step?.startsWith('done');

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-seal">🏛️</span>
          <div>
            <h1>The BureauCapital™ Calendar</h1>
            <p className="brand-sub">Official Instrument of Temporal Compliance · Est. Whenever Approved</p>
          </div>
        </div>
        <Wallet balance={state.wallet} />
      </header>

      <main>
        <CalendarGrid
          viewDate={viewDate}
          events={state.events}
          calendarUnlocked={calendarUnlocked}
          onNavigate={(dir) => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + dir, 1))}
          onDateClick={startCreate}
          onEventClick={setDetailEvent}
        />
        <p className="footer-note">
          Clicking a date initiates a legally ambiguous purchase. Weekend dates include a Premium Leisure Zone
          surcharge. The past is closed for renovations.
        </p>
      </main>

      {toast && <div className="toast">🗄️ {toast}</div>}

      {/* ——— Event detail ——— */}
      {detailEvent && !flow && (
        <Modal
          title="Event Record"
          onClose={() => setDetailEvent(null)}
          warnOnClose={false}
        >
          <div className="step step-center">
            <h3 className="cert-event">“{detailEvent.title}”</h3>
            <div className="cert-date">{new Date(detailEvent.dateISO + 'T00:00:00').toDateString()}</div>
            <div className="cert-permit">Permit № {detailEvent.permitNo}</div>
            {detailEvent.reasonForExisting && (
              <p className="fine-print">Reason for Existing (on file): “{detailEvent.reasonForExisting}”</p>
            )}
            <div className="btn-row">
              <button className="btn btn-secondary" onClick={() => startEdit(detailEvent)}>
                Request Amendment ({fmt(FEES.amendment)} + sincerity)
              </button>
              <button className="btn btn-danger" onClick={() => startDelete(detailEvent)}>
                Request Cancellation ({fmt(FEES.cancellation + FEES.feeCancellation)} + dignity)
              </button>
            </div>
            <p className="fine-print">
              Warning: modifying an event is procedurally harsher than creating one. This is by design. The design
              was approved.
            </p>
          </div>
        </Modal>
      )}

      {/* ——— Active workflow ——— */}
      {flow && (
        <Modal
          title={STEP_TITLES[step] ?? 'Processing'}
          stepLabel={`Step ${flow.stepIndex + 1} of ${flow.steps.length} — ${progressJoke(frac)}`}
          progress={frac * 100}
          onClose={closeFlow}
          warnOnClose={!isDoneStep}
          closable={step !== 'approval' && !step?.startsWith('ad:')}
          wide={step?.startsWith('form') || step === 'invoice' || step === 'purchase'}
        >
          {renderStep()}

          {interstitial && (
            <div className="confirm-close">
              <div className="confirm-close-card">
                <h3>🚧 System Notice</h3>
                <p>{interstitial.msg}</p>
                <div className="btn-row">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      const { resume } = interstitial;
                      setInterstitial(null);
                      resume();
                    }}
                  >
                    Retry (it will work this time)
                  </button>
                </div>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );

  function renderStep() {
    if (!flow) return null;

    // ——— Create flow ———
    if (step === 'purchase') {
      return (
        <PurchaseAccess
          date={flow.date}
          wallet={state.wallet}
          onPay={(total) => {
            spend(total);
            advance({ accessPaid: total });
          }}
        />
      );
    }
    if (step?.startsWith('form:')) {
      const idx = Number(step.split(':')[1]);
      return (
        <FormWizard
          key={step}
          form={CREATE_FORMS[idx]}
          onSubmit={(values) => advance(values)}
        />
      );
    }
    if (step === 'approval') {
      return <ApprovalProcess wallet={state.wallet} onSpend={spend} onApproved={() => advance()} />;
    }
    if (step === 'invoice') {
      return (
        <Invoice
          accessPrice={flow.data.accessPaid ?? 0}
          wallet={state.wallet}
          onPay={(total) => {
            spend(total);
            advance();
          }}
        />
      );
    }
    if (step?.startsWith('ad:')) {
      const idx = Number(step.split(':')[1]);
      return <AdGauntlet key={step} adIndex={idx} onDone={() => advance()} />;
    }
    if (step?.startsWith('captcha:')) {
      const idx = Number(step.split(':')[1]);
      const isLast = idx === 2;
      return (
        <CaptchaGauntlet
          key={step}
          challengeIndex={idx}
          onPass={() => {
            if (isLast) {
              const event = {
                id: crypto.randomUUID(),
                dateISO: toISO(flow.date),
                title: flow.data.title || 'Untitled Compliance Gathering',
                permitNo: permitNumber(),
                reasonForExisting: flow.data.reasonForExisting,
                funLikelihood: flow.data.funLikelihood,
              };
              dispatch({ type: 'ADD_EVENT', event });
              setFlow((f) => ({ ...f, stepIndex: f.stepIndex + 1, data: { ...f.data, createdEvent: event } }));
            } else {
              advance();
            }
          }}
        />
      );
    }
    if (step === 'done') {
      return <EventCreated event={flow.data.createdEvent} onClose={closeFlow} />;
    }

    // ——— Unlock-today flow ———
    if (step === 'petition') {
      return (
        <FormWizard
          form={TODAY_FORM}
          onSubmit={(values) => advance(values)}
          submitLabel="Petition the Present"
        />
      );
    }
    if (step === 'unlock-fee') {
      return (
        <FeePayment
          title="Present Moment Disclosure Fees"
          items={[
            { label: 'Present Moment Disclosure Fee', amount: 9.99 },
            { label: 'Temporal Transparency Surcharge', amount: 4.25 },
            { label: 'Redaction Removal Labor (1 unit)', amount: 6.5 },
          ]}
          wallet={state.wallet}
          onPay={(total) => {
            spend(total);
            advance();
          }}
        />
      );
    }
    if (step === 'unlock-done') {
      return (
        <div className="step step-center">
          <div className="stamp stamp-approved">DECLASSIFIED</div>
          <h3>The Calendar Has Been Disclosed</h3>
          <p>
            Congratulations. You are now legally cleared to perceive dates. Today is{' '}
            <strong>{new Date().toDateString()}</strong>. This clearance expires at midnight, at which point
            the calendar re-classifies itself.
          </p>
          <p className="fine-print">
            To actually schedule something, click a date and complete the standard purchase, forms, review,
            invoice, advertisement, and verification processes. Perceiving is not scheduling.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => {
              dispatch({ type: 'UNLOCK_TODAY', iso: toISO(new Date()) });
              closeFlow();
            }}
          >
            Acknowledge Today →
          </button>
        </div>
      );
    }

    // ——— Edit flow ———
    if (step === 'form-edit') {
      return (
        <FormWizard
          form={EDIT_FORM}
          initialValues={{ title: flow.event.title }}
          onSubmit={(values) => advance(values)}
          submitLabel="Submit Amendment"
        />
      );
    }
    if (step === 'fee-edit') {
      return (
        <FeePayment
          title="Amendment Fee Schedule"
          items={[
            { label: 'Amendment Fee (Form D-86)', amount: FEES.amendment },
            { label: 'Intention Recalibration Surcharge', amount: 8.75 },
            { label: 'Janet Consultation Retainer', amount: 12.0 },
          ]}
          wallet={state.wallet}
          onPay={(total) => {
            spend(total);
            advance();
          }}
        />
      );
    }
    if (step === 'supervisor') {
      return (
        <SupervisorApproval
          onApproved={() => {
            dispatch({
              type: 'UPDATE_EVENT',
              id: flow.event.id,
              patch: { title: flow.data.title || flow.event.title },
            });
            advance();
          }}
        />
      );
    }
    if (step === 'done-edit') {
      return (
        <div className="step step-center">
          <div className="stamp stamp-approved">AMENDED</div>
          <h3>Amendment Certified</h3>
          <p>
            Your event is now officially “{flow.data.title || flow.event.title}”. Janet has initialed the change and
            filed it under “W” for “Whatever”.
          </p>
          <button className="btn btn-primary" onClick={closeFlow}>
            Return to Calendar
          </button>
        </div>
      );
    }

    // ——— Delete flow ———
    if (step === 'form-delete') {
      return (
        <FormWizard
          form={DELETE_FORM}
          onSubmit={(values) => advance(values)}
          submitLabel="Submit Cancellation Request"
        />
      );
    }
    if (step === 'notice') {
      return <AdvanceNotice onDone={() => advance()} />;
    }
    if (step === 'fee-delete') {
      return (
        <FeePayment
          title="Cancellation Fee Schedule"
          items={[
            { label: 'Cancellation Fee', amount: FEES.cancellation },
            { label: 'Fee Cancellation Fee (fee for cancelling with fees)', amount: FEES.feeCancellation },
            { label: 'Emotional Processing Levy', amount: 5.55 },
          ]}
          wallet={state.wallet}
          onPay={(total) => {
            spend(total);
            advance();
          }}
        />
      );
    }
    if (step === 'rescind') {
      return (
        <RescindPhrase
          eventTitle={flow.event.title}
          onConfirm={() => {
            dispatch({ type: 'DELETE_EVENT', id: flow.event.id });
            advance();
          }}
        />
      );
    }
    if (step === 'done-delete') {
      return (
        <div className="step step-center">
          <div className="stamp stamp-rejected">RESCINDED</div>
          <h3>Fun Successfully Rescinded</h3>
          <p>
            “{flow.event.title}” has been struck from the record. The record will remember. The fees will remain.
          </p>
          <button className="btn btn-primary" onClick={closeFlow}>
            Return to Calendar
          </button>
        </div>
      );
    }

    return null;
  }
}
