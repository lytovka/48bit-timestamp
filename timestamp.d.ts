/**
 * Generates a 48-bit timestamp encoded in Base64URL format from a Date object
 *
 * Format (48 bits total):
 * - 12 bits: year (0-4095)
 * - 4 bits: month (1-12)
 * - 5 bits: day (1-31)
 * - 5 bits: hour (0-23)
 * - 6 bits: minute (0-59)
 * - 6 bits: second (0-59)
 * - 10 bits: millisecond (0-999)
 *
 * @param date - Date to encode (defaults to current time)
 * @returns Base64URL encoded timestamp (8 characters)
 * @throws {Error} If date is invalid or any component exceeds bit capacity
 */
export function generateTimestamp48(date?: Date): string;
