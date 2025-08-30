/**
 * Decodes a 48-bit timestamp into a JavaScript Date object
 * @param {Buffer|Uint8Array|number[]} bytes - 6 bytes representing the timestamp
 * @returns {Date} JavaScript Date object
 */
function decode48BitTimestamp(bytes) {
    // Convert input to a 48-bit BigInt
    let timestamp;
    if (typeof bytes === 'number') {
        timestamp = BigInt(bytes);
    } else {
        timestamp = 0n;
        for (let i = 0; i < 6; i++) {
            timestamp = (timestamp << 8n) | BigInt(bytes[i]);
        }
    }

    // Extract components using BigInt operations
    const millisecond = Number(timestamp & 0x3FFn);
    timestamp = timestamp >> 10n;

    const second = Number(timestamp & 0x3Fn);
    timestamp = timestamp >> 6n;

    const minute = Number(timestamp & 0x3Fn);
    timestamp = timestamp >> 6n;

    const hour = Number(timestamp & 0x1Fn);
    timestamp = timestamp >> 5n;

    const day = Number(timestamp & 0x1Fn);
    timestamp = timestamp >> 5n;

    const month = Number(timestamp & 0xFn) - 1; // JavaScript months are 0-based
    timestamp = timestamp >> 4n;

    const year = Number(timestamp & 0xFFFn);

    return new Date(Date.UTC(year, month, day, hour, minute, second, millisecond));
}

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
const hexTimestamp = "7E3684CB594D"; // 2019-06-16 19:11:22.333
const bytes = Buffer.from(hexTimestamp, 'hex');
const date = decode48BitTimestamp(bytes);
console.log(date.toISOString()); // Should output: 2019-06-16T19:11:22.333Z

const encodedBuffer = encode48BitTimestamp(date);
console.log(encodedBuffer.toString('hex').toUpperCase()); // Should output: 7E3684CB594D
