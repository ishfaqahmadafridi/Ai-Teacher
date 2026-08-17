/**
  * Formats a phone number cleanly with default country dial code (+92).
  */
export function formatPhoneWithCountryCode(mobile?: string, countryCode?: string): string {
  if (!mobile) return '+92 300 1234567';

  const trimmedMobile = String(mobile).trim();
  if (trimmedMobile.startsWith('+')) {
    return trimmedMobile;
  }

  let prefix = '+92';
  if (countryCode) {
    const cCode = String(countryCode).trim();
    if (cCode.startsWith('+')) {
      prefix = cCode;
    } else if (/^\d+$/.test(cCode)) {
      prefix = `+${cCode}`;
    }
  }

  const cleanNumber = trimmedMobile.startsWith('0') ? trimmedMobile.slice(1) : trimmedMobile;
  return `${prefix} ${cleanNumber}`;
}

/**
 * Generates a clean 4-digit sequential numeric Student ID (e.g. STU-2026-0001).
 */
export function generateFormattedStudentId(idOrUsername?: unknown): string {
  if (idOrUsername === null || idOrUsername === undefined || idOrUsername === '') {
    return 'STU-2026-0001';
  }
  
  const strVal = String(idOrUsername);
  const digitsMatch = strVal.match(/\d+/g)?.join('');
  let numVal = 1;
  
  if (digitsMatch && digitsMatch.length >= 1) {
    numVal = parseInt(digitsMatch.slice(-4), 10) || 1;
  } else {
    let hash = 0;
    for (let i = 0; i < strVal.length; i++) {
      hash = (hash << 5) - hash + strVal.charCodeAt(i);
      hash |= 0;
    }
    numVal = (Math.abs(hash) % 9999) + 1;
  }

  const paddedNum = String(numVal).padStart(4, '0');
  return `STU-2026-${paddedNum}`;
}
