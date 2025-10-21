// Polyfill TextEncoder/TextDecoder for environments that lack them (Node < 11)
const { TextEncoder, TextDecoder } = require('util');
if (typeof global.TextEncoder === 'undefined') global.TextEncoder = TextEncoder;
if (typeof global.TextDecoder === 'undefined') global.TextDecoder = TextDecoder;

// You can add other global mocks here if needed
