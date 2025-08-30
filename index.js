/**
 * Encodes a JavaScript Date into a 48-bit timestamp
 * @param {Date} date - Date to encode
 * @returns {Buffer} 6-byte buffer containing the encoded timestamp
 */
function encode48BitTimestamp(date) {
    // Extract date components in UTC
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1; // JavaScript months are 0-based
    const day = date.getUTCDate();
    const hour = date.getUTCHours();
    const minute = date.getUTCMinutes();
    const second = date.getUTCSeconds();
    const millisecond = date.getUTCMilliseconds();

    // Validate ranges
    if (year > 4095) throw new Error('Year exceeds 12-bit capacity (0-4095)');
    if (month > 12) throw new Error('Month exceeds 4-bit capacity (1-12)');
    if (day > 31) throw new Error('Day exceeds 5-bit capacity (1-31)');
    if (hour > 23) throw new Error('Hour exceeds 5-bit capacity (0-23)');
    if (minute > 59) throw new Error('Minute exceeds 6-bit capacity (0-59)');
    if (second > 59) throw new Error('Second exceeds 6-bit capacity (0-59)');
    if (millisecond > 999) throw new Error('Millisecond exceeds 10-bit capacity (0-999)');

    // Construct the timestamp using BigInt
    let timestamp = 0n;
    timestamp = (timestamp << 12n) | BigInt(year);
    timestamp = (timestamp << 4n) | BigInt(month);
    timestamp = (timestamp << 5n) | BigInt(day);
    timestamp = (timestamp << 5n) | BigInt(hour);
    timestamp = (timestamp << 6n) | BigInt(minute);
    timestamp = (timestamp << 6n) | BigInt(second);
    timestamp = (timestamp << 10n) | BigInt(millisecond);

    // Convert to 6-byte buffer
    const buffer = Buffer.alloc(6);
    for (let i = 5; i >= 0; i--) {
        buffer[i] = Number(timestamp & 0xFFn);
        timestamp = timestamp >> 8n;
    }

    return buffer;
}

// Example usage
const now = new Date();
const nowEncoded = encode48BitTimestamp(now);
console.log('Now:', now.toISOString());
console.log('Encoded:', nowEncoded.toString('hex').toUpperCase());
console.log("base64url:", nowEncoded.toString('base64url'));
