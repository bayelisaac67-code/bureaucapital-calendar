export const REJECTION_REASONS = [
  'Ink color insufficiently blue.',
  'Form C was suspiciously enthusiastic.',
  'Handwriting detected in a typed field.',
  'Application submitted during a leap second. Void.',
  'Your staple orientation contradicts your zodiac sign.',
  'Margins exceed the federally mandated optimism threshold.',
  'Reason for Existing deemed "too existential" by Reviewer #2.',
  'Coffee consumption figure not expressed in imperial cups.',
  'Signature contains detectable levels of joy.',
  'Form was filled out correctly, which we found suspicious.',
];

export const PROCESSING_STATUSES = [
  'Receiving application…',
  'Locating filing cabinet…',
  'Filing cabinet located. Wrong cabinet.',
  'Application lost in filing cabinet. Re-filing…',
  'Stamping…',
  'Re-stamping (first stamp insufficiently authoritative)…',
  'Routing to Department of Redundancy Department…',
  'Awaiting sign-off from Janet (on lunch break)…',
  'Janet has returned. Janet has left again.',
  'Consulting the Manual of Manuals…',
  'Verifying that verification was verified…',
  'Escalating to a more important desk…',
  'Printing digital copy for physical archive…',
  'Shredding duplicate. Duplicating shred report…',
  'Final review (draft)…',
];

export const INTERSTITIAL_ERRORS = [
  'Calendar is on lunch break. (Back in 5 minutes, ±3 business days.)',
  'Application lost in filing cabinet.',
  'Insufficient Bureaucracy. Please try again with more forms.',
  'Error 1099: This error is tax-deductible.',
  'The scheduling department is currently scheduling its own meeting.',
  'System is down for scheduled unscheduled maintenance.',
  'Your request was received and immediately misplaced.',
];

export const CLOSE_WARNING =
  'Progress will be lost. Bureaucracy never forgets — but it does lose paperwork. (No refunds.)';

export const PAST_DATE_ERROR =
  'The past is non-refundable. See Form H-1975: Retroactive Regret Declaration.';

export function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
