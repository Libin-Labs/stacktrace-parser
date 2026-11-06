import test from 'node:test';
import assert from 'node:assert/strict';
import { parseStackTrace } from '../dist/esm/index.js';
test('parses V8 named frames', () => {
  const result = parseStackTrace('Error\n    at run (file:///app.js:4:9)');
  assert.equal(result.frames[0].functionName, 'run');
  assert.equal(result.frames[0].line, 4);
});
test('parses V8 anonymous frames', () => {
  assert.equal(parseStackTrace('    at file:///a.js:1:2').frames[0].file, 'file:///a.js');
});
test('parses Firefox frames', () => {
  const frame = parseStackTrace('run@https://x/a.js:8:3').frames[0];
  assert.equal(frame.functionName, 'run');
  assert.equal(frame.column, 3);
});
test('retains raw lines and diagnoses malformed lines', () => {
  const result = parseStackTrace('Error\nbroken frame');
  assert.deepEqual(result.diagnostics, ['Line 2: unrecognized frame']);
});
test('does not silently accept invalid numeric locations', () => {
  assert.equal(parseStackTrace('at x.js:0:1').frames.length, 0);
});
test('supports CRLF and skips error headings', () => {
  assert.equal(parseStackTrace('Error: fail\r\n at fn (x:2:5)').frames.length, 1);
});
test('enforces input and frame budgets', () => {
  assert.throws(() => parseStackTrace('long', { maxLength: 2 }), RangeError);
  assert.throws(() => parseStackTrace('at a:1:1\nat b:2:2', { maxFrames: 1 }), RangeError);
});
