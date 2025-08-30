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
 * @param {Date} [date=new Date()] - Date to encode (defaults to current time)
 * @returns {string} Base64URL encoded timestamp (8 characters)
 * @throws {Error} If date is invalid or any component exceeds bit capacity
 */
function generateTimestamp48(date = new Date()) {
    // Check if date is valid
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        throw new Error('Invalid date provided');
    }

    // Pre-allocate the buffer for better performance
    const buffer = Buffer.allocUnsafe(6);

    // Extract date components (UTC)
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const hour = date.getUTCHours();
    const minute = date.getUTCMinutes();
    const second = date.getUTCSeconds();
    const millisecond = date.getUTCMilliseconds();

    if (year > 4095) throw new Error('Year exceeds 12-bit capacity (0-4095)');
    if (month > 12) throw new Error('Month exceeds 4-bit capacity (1-12)');
    if (day > 31) throw new Error('Day exceeds 5-bit capacity (1-31)');
    if (hour > 23) throw new Error('Hour exceeds 5-bit capacity (0-23)');
    if (minute > 59) throw new Error('Minute exceeds 6-bit capacity (0-59)');
    if (second > 59) throw new Error('Second exceeds 6-bit capacity (0-59)');
    if (millisecond > 999) throw new Error('Millisecond exceeds 10-bit capacity (0-999)');

    // Directly set bytes in buffer - more efficient than shifting BigInt
    // First byte: high 8 bits of year
    buffer[0] = (year >> 4) & 0xFF;

    // Second byte: low 4 bits of year + high 4 bits of month
    buffer[1] = ((year & 0x0F) << 4) | (month & 0x0F);

    // Third byte: day (5 bits) + high 3 bits of hour
    buffer[2] = ((day & 0x1F) << 3) | ((hour >> 2) & 0x07);

    // Fourth byte: low 2 bits of hour + minute (6 bits)
    buffer[3] = ((hour & 0x03) << 6) | (minute & 0x3F);

    // Fifth byte: second (6 bits) + high 2 bits of millisecond
    buffer[4] = ((second & 0x3F) << 2) | ((millisecond >> 8) & 0x03);

    // Sixth byte: low 8 bits of millisecond
    buffer[5] = millisecond & 0xFF;

    // Return buffer encoded as Base64URL
    return buffer.toString('base64url');
}

module.exports = {generateTimestamp48};
