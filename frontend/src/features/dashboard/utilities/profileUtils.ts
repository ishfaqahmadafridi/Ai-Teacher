/**
  * Formats a phone number cleanly with default country dial code (+92).
  */
export function formatPhoneWithCountryCode(mobile?: string, countryCode?: string): string {
  if (!mobile) return '';

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

/** Format the actual database ID without truncation or fabricated fallback IDs. */
export function generateFormattedStudentId(id?: string, createdAt?: string): string {
  if (!id) return '';
  const joined = createdAt ? new Date(createdAt) : null;
  const year = joined && !Number.isNaN(joined.getTime()) ? `${joined.getFullYear()}-` : '';
  return `STU-${year}${id.padStart(4, '0')}`;
}
