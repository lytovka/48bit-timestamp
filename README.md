# 48bit-timestamp
A utility for generating 48-bit timestamps encoded in Base64URL format.

## Description
This library provides a fast and correct implementation of a 48-bit timestamp generator. The timestamps are encoded in Base64URL format, resulting in 8-character strings that contain datetime information.

## Usage

```javascript
const { generateTimestamp48 } = require('48bit-timestamp');

// Generate timestamp for current time
const timestamp = generateTimestamp48();
console.log(timestamp); // e.g. "fjBsXTY9"

// Generate timestamp for specific date
const date = new Date('2023-06-15T14:30:45.123Z');
const specificTimestamp = generateTimestamp48(date);
console.log(specificTimestamp);
```

## Technical Details
The 48-bit timestamp is constructed with the following bit allocation:

| Component   | Bits | Range     |
|-------------|------|-----------|
| Year        | 12   | 0-4095    |
| Month       | 4    | 1-12      |
| Day         | 5    | 1-31      |
| Hour        | 5    | 0-23      |
| Minute      | 6    | 0-59      |
| Second      | 6    | 0-59      |
| Millisecond | 10   | 0-999     |

All timestamps are generated in UTC time.

## Project structure
```
.
├── AI_PROMPTS.md # Development prompts used during implementation
├── LICENSE
├── SETUP.md # OS and Node.js environment details
├── package.json
├── timestamp.d.ts # TypeScript declaration file
├── timestamp.js # Main implementation file
└── timestamp.test.js # Unit tests
```
