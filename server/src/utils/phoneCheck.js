/**
 * Validates and normalizes an Indian mobile number.
 * Accepts common input variations (spaces, dashes, +91 or 0 prefix) and
 * checks it reduces to a genuine 10-digit Indian mobile number (starts 6-9).
 * Returns { ok: true, normalized: '9XXXXXXXXX' } or { ok: false, reason: string }.
 *
 * Note: this is a FORMAT check only -- it confirms the number is shaped like
 * a real Indian mobile number, not that this specific person owns it. Actual
 * ownership verification would need OTP (a paid SMS gateway), which is a
 * separate decision -- see project notes.
 */
function checkMobileFormat(raw) {
  if (!raw) {
    return { ok: false, reason: 'Please enter a phone number.' };
  }

  let digits = String(raw).replace(/[^\d]/g, '');

  // Strip a leading country code or trunk prefix so we're left with the 10-digit number.
  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  if (digits.length !== 10) {
    return { ok: false, reason: 'Please enter a valid 10-digit mobile number.' };
  }
  if (!/^[6-9]\d{9}$/.test(digits)) {
    return { ok: false, reason: 'That doesn\'t look like a valid Indian mobile number.' };
  }
  // Reject obviously fake repeated-digit numbers, e.g. 9999999999 / 6666666666.
  if (/^(\d)\1{9}$/.test(digits)) {
    return { ok: false, reason: 'Please enter your real mobile number.' };
  }

  return { ok: true, normalized: digits };
}

module.exports = { checkMobileFormat };
