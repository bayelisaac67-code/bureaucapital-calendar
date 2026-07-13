import { useState, useMemo } from 'react';

// Renders a single official form definition with fake bureaucratic validation.
// Once per form, one random valid field will "fail review" and demand re-entry.
export default function FormWizard({ form, initialValues = {}, onSubmit, submitLabel = 'Submit for Review' }) {
  const [values, setValues] = useState(() => {
    const v = {};
    for (const f of form.fields) {
      v[f.key] = initialValues[f.key] ?? (f.type === 'checkbox' ? false : f.type === 'slider' ? 0 : '');
    }
    return v;
  });
  const [errors, setErrors] = useState({});
  const [reviewFailed, setReviewFailed] = useState(false);
  // Pre-pick which field will arbitrarily fail review (comedy tax, once per form)
  const doomedField = useMemo(
    () => form.fields[Math.floor(Math.random() * form.fields.length)].key,
    [form]
  );

  const set = (key, val) => {
    setValues((v) => ({ ...v, [key]: val }));
    setErrors((e) => ({ ...e, [key]: null }));
  };

  const submit = () => {
    const errs = {};
    for (const f of form.fields) {
      const err = f.validate(values[f.key]);
      if (err) errs[f.key] = err;
    }
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    if (!reviewFailed) {
      // Arbitrary bureaucratic rejection of one perfectly fine field.
      setReviewFailed(true);
      setErrors({ [doomedField]: 'Field failed secondary review. Reason: unspecified. Please re-enter.' });
      const doomed = form.fields.find((f) => f.key === doomedField);
      setValues((v) => ({ ...v, [doomedField]: doomed.type === 'checkbox' ? false : doomed.type === 'slider' ? 0 : '' }));
      return;
    }
    onSubmit(values);
  };

  return (
    <div className="step">
      <div className="form-header">
        <div className="form-id">{form.id}</div>
        <div>
          <h3 className="form-title">{form.title}</h3>
          <div className="form-subtitle">{form.subtitle}</div>
        </div>
      </div>

      {form.fields.map((f) => (
        <div key={f.key} className={'field' + (errors[f.key] ? ' field-error' : '')}>
          <label className="field-label" htmlFor={f.key}>
            {f.label} <span className="req">*</span>
          </label>
          {renderInput(f, values[f.key], (val) => set(f.key, val))}
          {f.type === 'slider' && f.warnAbove != null && values[f.key] > f.warnAbove && (
            <div className="field-warning">{f.warning}</div>
          )}
          {errors[f.key] && <div className="field-error-msg">✗ {errors[f.key]}</div>}
        </div>
      ))}

      <div className="btn-row">
        <button className="btn btn-primary" onClick={submit}>
          {submitLabel}
        </button>
      </div>
      <p className="fine-print">All fields are mandatory. Optional fields are also mandatory.</p>
    </div>
  );
}

function renderInput(f, value, set) {
  switch (f.type) {
    case 'text':
      return (
        <input
          id={f.key}
          type="text"
          value={value}
          placeholder={f.placeholder}
          onChange={(e) => set(e.target.value)}
        />
      );
    case 'textarea':
      return (
        <textarea
          id={f.key}
          rows={3}
          value={value}
          placeholder={f.placeholder}
          onChange={(e) => set(e.target.value)}
        />
      );
    case 'date':
      return <input id={f.key} type="date" value={value} onChange={(e) => set(e.target.value)} />;
    case 'slider':
      return (
        <div className="slider-row">
          <input
            id={f.key}
            type="range"
            min={f.min}
            max={f.max}
            value={value}
            onChange={(e) => set(Number(e.target.value))}
          />
          <span className="slider-value">{value}%</span>
        </div>
      );
    case 'radio':
      return (
        <div className="radio-group">
          {f.options.map((opt) => (
            <label key={opt} className="radio-option">
              <input
                type="radio"
                name={f.key}
                checked={value === opt}
                onChange={() => set(opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      );
    case 'select':
      return (
        <select id={f.key} value={value} onChange={(e) => set(e.target.value)}>
          <option value="">— Select from approved list —</option>
          {f.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    case 'checkbox':
      return (
        <label className="radio-option">
          <input type="checkbox" checked={value} onChange={(e) => set(e.target.checked)} /> Yes, I confirm
        </label>
      );
    default:
      return null;
  }
}
