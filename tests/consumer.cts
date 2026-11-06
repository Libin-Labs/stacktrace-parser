import { parseStackTrace } from '@lp-labs/stacktrace-parser';
const count: number = parseStackTrace('Error').frames.length;
// @ts-expect-error maxFrames must be numeric.
parseStackTrace('Error', { maxFrames: 'one' });
void count;
