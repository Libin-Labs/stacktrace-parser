import {
  parseStackTrace,
  type StackFrame,
  type StackParseResult,
} from '@lp-labs/stacktrace-parser';
const parsed: StackParseResult = parseStackTrace('at file.js:1:2');
const frame: StackFrame | undefined = parsed.frames[0];
// @ts-expect-error trace input must be a string.
parseStackTrace(42);
void frame;
