const { describe, it } = require('node:test');
const assert = require('node:assert');
const { generateTimestamp48 } = require('./timestamp');

describe('generateTimestamp48', () => {
    it('should generate an 8-character string', () => {
        const result = generateTimestamp48();
        assert.strictEqual(typeof result, 'string');
        assert.strictEqual(result.length, 8);
    });

    it('should generate a valid Base64URL string', () => {
        const result = generateTimestamp48();
        // Base64URL uses A-Z, a-z, 0-9, -, and _ only
        assert.match(result, /^[A-Za-z0-9_-]{8}$/);
    });

    // Test with specific dates
    it('should correctly encode a specific date', () => {
        // 2019-06-16 19:11:22.333 UTC should be 0x7E36844CB594D (example from spec)
        const testDate = new Date('2019-06-16T19:11:22.333Z');
        const result = generateTimestamp48(testDate);

        // Convert back to buffer for verification
        const buffer = Buffer.from(result, 'base64url');

        // Verify each byte matches expected value
        assert.strictEqual(buffer[0], 0x7E);
        assert.strictEqual(buffer[1], 0x36);
        assert.strictEqual(buffer[2], 0x84);
        assert.strictEqual(buffer[3], 0xCB);
        assert.strictEqual(buffer[4], 0x59);
        assert.strictEqual(buffer[5], 0x4D);
    });

    it('should handle date at year boundary', () => {
        const testDate = new Date('2023-12-31T23:59:59.999Z');
        const result = generateTimestamp48(testDate);
        assert.ok(result);
    });

    // Test error cases
    it('should throw error for year exceeding 4095', () => {
        const futureDate = new Date();
        futureDate.setUTCFullYear(4096);
        assert.throws(() => generateTimestamp48(futureDate), /Year exceeds 12-bit capacity/);
    });

    it('should throw error for invalid date', () => {
        const invalidDate = new Date('invalid');
        assert.throws(() => generateTimestamp48(invalidDate));
    });

    // Test consistency
    it('should generate consistent results for same input', () => {
        const testDate = new Date('2022-05-15T10:30:45.500Z');
        const result1 = generateTimestamp48(testDate);
        const result2 = generateTimestamp48(testDate);
        assert.strictEqual(result1, result2);
    });

    // Performance test
    it('performance: 1 million iterations under 300ms', () => {
        const iterations = 1000_000;
        const startTime = process.hrtime.bigint();
        for (let i = 0; i < iterations; i++) {
            generateTimestamp48();
        }
        const endTime = process.hrtime.bigint();
        const durationMs = (endTime - startTime) / 1000_000n;
        console.log(`Performance: ${iterations} iterations in ${durationMs}ms`);
        assert.ok(durationMs < 300, `Performance test took too long: ${durationMs}ms`);
    });
});
