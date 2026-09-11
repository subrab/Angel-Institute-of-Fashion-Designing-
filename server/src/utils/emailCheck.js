const dns = require('dns').promises;

// Well-known disposable/throwaway email providers. Not exhaustive, but covers
// the services people commonly use to fake a "real" email at signup.
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.info', '10minutemail.com',
  'tempmail.com', 'temp-mail.org', 'throwawaymail.com', 'yopmail.com',
  'trashmail.com', 'fakeinbox.com', 'getnada.com', 'dispostable.com',
  'sharklasers.com', 'maildrop.cc', 'mintemail.com', 'mohmal.com',
  'emailondeck.com', 'spamgourmet.com', 'mailnesia.com', 'discard.email',
  'tempinbox.com', 'moakt.com', 'mailcatch.com', 'einrot.com',
  'fakemailgenerator.com', 'mailsac.com', 'inboxbear.com', '33mail.com',
]);

/**
 * Checks that an email address's domain is a real, mail-capable domain and
 * not a known disposable/throwaway service.
 * Returns { ok: true } or { ok: false, reason: string }.
 */
async function checkEmailIsGenuine(email) {
  const domain = String(email).split('@')[1];
  if (!domain) {
    return { ok: false, reason: 'That email address doesn\'t look valid.' };
  }

  if (DISPOSABLE_DOMAINS.has(domain.toLowerCase())) {
    return { ok: false, reason: 'Please use a real, permanent email address rather than a temporary one.' };
  }

  try {
    const records = await dns.resolveMx(domain);
    if (!records || records.length === 0) {
      return { ok: false, reason: 'We couldn\'t verify that email domain. Please double-check it.' };
    }
    return { ok: true };
  } catch (err) {
    // NXDOMAIN, ENODATA, timeout, etc. -- the domain can't receive mail.
    return { ok: false, reason: 'We couldn\'t verify that email domain. Please double-check it.' };
  }
}

module.exports = { checkEmailIsGenuine };
