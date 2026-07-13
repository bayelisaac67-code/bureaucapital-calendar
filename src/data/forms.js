// Official form definitions. Do not laminate.

export const CREATE_FORMS = [
  {
    id: 'A-17',
    title: 'Form A-17 — Preliminary Intent to Schedule',
    subtitle: 'Bureau of Temporal Affairs · Rev. 1987-C · Retain no copies',
    fields: [
      {
        key: 'title',
        label: 'Proposed Event Designation (Title)',
        type: 'text',
        placeholder: 'e.g. Mandatory Fun Session #4',
        validate: (v) => (v.trim().length < 3 ? 'Designation must be at least 3 characters. Brevity is suspicious.' : null),
      },
      {
        key: 'reasonForExisting',
        label: 'Reason for Existing',
        type: 'textarea',
        placeholder: 'Justify your continued presence on this plane (min. 20 characters)',
        validate: (v) =>
          v.trim().length < 20 ? 'Insufficient justification. Please exist harder (min. 20 characters).' : null,
      },
      {
        key: 'funLikelihood',
        label: 'Likelihood of Fun (%) — statutory minimum: 90%',
        type: 'slider',
        min: 0,
        max: 100,
        warnAbove: 30,
        warning: '⚠ Fun levels above 30% require Form F-UN, which does not exist.',
        validate: (v) =>
          v < 90
            ? 'Fun likelihood below 90% violates the Mandatory Enjoyment Act of 1994. Raise your enthusiasm.'
            : null,
      },
      {
        key: 'scheduledBefore',
        label: 'Have you ever scheduled an event before?',
        type: 'radio',
        options: ['Yes', 'No', 'Unsure', 'I decline to remember'],
        validate: (v) => (!v ? 'A non-answer is only acceptable on Form NA-1.' : null),
      },
    ],
  },
  {
    id: 'B-24',
    title: 'Form B-24 — Logistical Feasibility Declaration',
    subtitle: 'Division of Hypothetical Logistics · Submit in triplicate (mentally)',
    fields: [
      {
        key: 'coffee',
        label: 'Expected Coffee Consumption (cups, to exactly 2 decimal places)',
        type: 'text',
        placeholder: 'e.g. 3.50',
        validate: (v) =>
          /^\d+\.\d{2}$/.test(v.trim())
            ? null
            : 'Must be a number with exactly 2 decimal places. Approximate caffeine is a felony.',
      },
      {
        key: 'stapleOrientation',
        label: 'Preferred Staple Orientation',
        type: 'radio',
        options: [
          'Vertical (traditional)',
          'Horizontal (progressive)',
          'Diagonal (requires supervisor approval)',
          'Stapleless (anarchist)',
        ],
        validate: (v) => (!v ? 'Unstapled paperwork is how civilizations fall.' : null),
      },
      {
        key: 'attendees',
        label: 'Number of attendees, including yourself, excluding yourself',
        type: 'text',
        placeholder: 'Show your work',
        validate: (v) => (v.trim() === '' ? 'This field is impossible, but it is also required.' : null),
      },
      {
        key: 'zodiac',
        label: "Emergency contact's zodiac sign",
        type: 'select',
        options: [
          'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
          'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
          'Ophiuchus (contested)',
        ],
        validate: (v) => (!v ? 'We cannot contact anyone without knowing the stars.' : null),
      },
    ],
  },
  {
    id: 'C',
    title: 'Form C — Form Verification Form',
    subtitle: 'Office of Circular Confirmation · This form verifies forms, including itself',
    fields: [
      {
        key: 'didA17',
        label: 'Did you fill out Form A-17?',
        type: 'checkbox',
        validate: (v) => (!v ? 'Our records show you did. Please agree with our records.' : null),
      },
      {
        key: 'didB24',
        label: 'Did you fill out Form B-24?',
        type: 'checkbox',
        validate: (v) => (!v ? 'Denial of paperwork is itself paperwork (Form D-NIAL).' : null),
      },
      {
        key: 'isFormC',
        label: 'Is this Form C?',
        type: 'checkbox',
        validate: (v) => (!v ? 'It is. Please confirm reality to proceed.' : null),
      },
      {
        key: 'signature',
        label: 'Signature (type your full name in ALL CAPS while feeling official)',
        type: 'text',
        placeholder: 'FIRSTNAME LASTNAME',
        validate: (v) => {
          if (v.trim().length < 2) return 'Signature required. Ghost signatures are processed separately.';
          if (v !== v.toUpperCase()) return 'Lowercase detected. Insufficient officialness.';
          return null;
        },
      },
      {
        key: 'dateOfBirth',
        label: 'Date of Birth (you must prove you existed before your plans)',
        type: 'date',
        validate: (v) => {
          if (!v) return 'The Bureau requires proof of birth. Being alive is not sufficient evidence.';
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (new Date(v + 'T00:00:00') >= today)
            return 'Applicants born today or later may not schedule events. Nice try, time traveler.';
          return null;
        },
      },
    ],
  },
];

export const TODAY_FORM = {
  id: 'T-0',
  title: 'Form T-0 — Petition to Acknowledge the Present',
  subtitle: 'Bureau of Current Affairs · Today is classified until proven otherwise',
  fields: [
    {
      key: 'presentBusiness',
      label: 'State your business with the present moment',
      type: 'textarea',
      placeholder: 'Why do you require access to today? (min. 15 characters)',
      validate: (v) =>
        v.trim().length < 15 ? 'The present moment demands a fuller explanation (min. 15 characters).' : null,
    },
    {
      key: 'unprepared',
      label: 'Why were you not prepared for today yesterday?',
      type: 'text',
      placeholder: 'Excuses will be graded',
      validate: (v) => (v.trim() === '' ? 'Unpreparedness must be documented, not merely lived.' : null),
    },
    {
      key: 'appointment',
      label: 'Do you have an appointment to make appointments?',
      type: 'radio',
      options: ['Yes', 'No', 'I am the appointment'],
      validate: (v) => (!v ? 'Walk-ins are seen in order of paperwork thickness.' : null),
    },
  ],
};

export const EDIT_FORM = {
  id: 'D-86',
  title: 'Form D-86 — Notice of Changed Intentions',
  subtitle: 'Bureau of Second Thoughts · Amendment Fee applies ($75.00)',
  fields: [
    {
      key: 'title',
      label: 'Revised Event Designation',
      type: 'text',
      placeholder: 'New title for your revised ambitions',
      validate: (v) => (v.trim().length < 3 ? 'Revised designation must be at least 3 characters.' : null),
    },
    {
      key: 'whatChanged',
      label: 'What changed? (Be specific. We will check.)',
      type: 'textarea',
      placeholder: 'Describe the evolution of your intentions (min. 15 characters)',
      validate: (v) => (v.trim().length < 15 ? 'Vague change is indistinguishable from no change.' : null),
    },
    {
      key: 'regretLevel',
      label: 'Current Regret Level (%)',
      type: 'slider',
      min: 0,
      max: 100,
      warnAbove: 80,
      warning: '⚠ Regret above 80% qualifies you for Form D-86-B (Deep Regret), also unavailable.',
      validate: () => null,
    },
  ],
};

export const DELETE_FORM = {
  id: 'K-9',
  title: 'Form K-9 — Cancellation Request (Request to Regret)',
  subtitle: 'Department of Abandoned Commitments · Woof',
  fields: [
    {
      key: 'abandonReason',
      label: 'Reason for abandoning your commitments',
      type: 'textarea',
      placeholder: 'Explain yourself (min. 25 characters — guilt takes words)',
      validate: (v) => (v.trim().length < 25 ? 'Your excuse is too short to be believable (min. 25 characters).' : null),
    },
    {
      key: 'triedTurningItOff',
      label: 'Have you tried simply attending the event instead?',
      type: 'radio',
      options: ['Yes, it was worse', 'No', 'I am the event'],
      validate: (v) => (!v ? 'Required. All escapes must be documented.' : null),
    },
  ],
};
