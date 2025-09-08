export const formatPhoneNumberForWhatsApp = (phoneNumber: string): string => {
  // Remove all non-digit characters
  const digitsOnly = phoneNumber.replace(/\D/g, '');

  // Assuming North American numbers, prepend '1' if not already present
  // and ensure it starts with '+'
  if (digitsOnly.length === 10) {
    return `+1${digitsOnly}`;
  } else if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
    return `+${digitsOnly}`;
  } else if (digitsOnly.startsWith('+')) {
    return digitsOnly;
  }
  // Fallback for other formats, might need more robust internationalization
  return `+${digitsOnly}`;
};