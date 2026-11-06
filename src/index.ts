export interface StackFrame {
  readonly functionName?: string;
  readonly file?: string;
  readonly line?: number;
  readonly column?: number;
  readonly raw: string;
}
export interface StackParseResult {
  readonly frames: readonly StackFrame[];
  readonly diagnostics: readonly string[];
}
const V8 = /^\s*at (?:(.*?) \()?(.+?):(\d+):(\d+)\)?\s*$/;
const FIREFOX = /^\s*(.*?)@(.+?):(\d+):(\d+)\s*$/;
export function parseStackTrace(
  stack: string,
  options: { readonly maxLength?: number; readonly maxFrames?: number } = {},
): StackParseResult {
  if (typeof stack !== 'string') throw new TypeError('Stack trace must be a string');
  if (stack.length > (options.maxLength ?? 100_000))
    throw new RangeError('Stack trace exceeds length limit');
  const frames: StackFrame[] = [];
  const diagnostics: string[] = [];
  const lines = stack.split(/\r?\n/);
  const maxFrames = options.maxFrames ?? 1000;
  for (let index = 0; index < lines.length; index++) {
    const raw = lines[index]!;
    if (!raw.trim() || /^(?:Error(?::.*)?|Caused by:.*)$/.test(raw.trim())) continue;
    const match = V8.exec(raw) ?? FIREFOX.exec(raw);
    if (!match) {
      diagnostics.push(`Line ${index + 1}: unrecognized frame`);
      continue;
    }
    const line = Number(match[3]);
    const column = Number(match[4]);
    if (!Number.isSafeInteger(line) || line < 1 || !Number.isSafeInteger(column) || column < 1) {
      diagnostics.push(`Line ${index + 1}: invalid location`);
      continue;
    }
    const functionName = match[1]?.trim();
    frames.push(
      Object.freeze({
        ...(functionName ? { functionName } : {}),
        ...(match[2] ? { file: match[2] } : {}),
        line,
        column,
        raw,
      }),
    );
    if (frames.length > maxFrames) throw new RangeError('Stack trace has too many frames');
  }
  return Object.freeze({ frames: Object.freeze(frames), diagnostics: Object.freeze(diagnostics) });
}
