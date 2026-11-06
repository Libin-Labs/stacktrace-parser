# @lp-labs/stacktrace-parser

Bounded parser for common V8 and Firefox/Safari-style JavaScript stack frames. It retains raw frame
text and reports unrecognized lines instead of silently treating malformed text as a successful
empty trace.

## Install and quick start

```bash
npm install @lp-labs/stacktrace-parser
```

```js
import { parseStackTrace } from '@lp-labs/stacktrace-parser';

const result = parseStackTrace('Error: failed\n    at render (file:///app.js:12:8)');
if (result.frames[0]?.functionName !== 'render' || result.frames[0]?.line !== 12) {
  throw new Error('Stack frame parse failed');
}
```

Supports ESM, CommonJS, and TypeScript declarations with no runtime/peer dependencies.

## API

`parseStackTrace(stack, options?): StackParseResult` returns frozen `frames` and `diagnostics`.
`StackFrame` contains `raw` plus optional `functionName`, `file`, `line`, and `column`. A frame is
included only when positive safe-integer line and column values are parsed. `StackParseResult`
diagnostics identify unrecognized non-heading lines and invalid locations.

Options: `maxLength` defaults to 100,000 UTF-16 code units; `maxFrames` defaults to 1,000. The parser
recognizes V8 `at function (file:line:column)` / anonymous frames and `function@file:line:column`.
Error headings and blank lines are skipped.

## Errors and customization

Non-string input and invalid limits throw `TypeError` or `RangeError`; overlong traces or too many
valid frames throw `RangeError`. Frame text may contain URL schemes, drive letters, or colons; the
parser treats the final two colon-separated numeric groups as line and column. Engine formats differ,
so preserve the original error/stack when displaying or storing diagnostics. Custom formats should
be handled by an application adapter, not by guessing from malformed lines.

## Performance and scope

Parsing is linear in total stack text and retains at most the configured number of parsed frames plus
diagnostic strings for unrecognized lines. This is not a source-map consumer, symbolicator, or
guaranteed parser for every engine, transpiler, native frame, or browser extension format.

## Support

If this library is useful to you, consider supporting its maintenance with a [donation via PayPal](https://www.paypal.me/LibinPrasanth).

## Author

Created by [Libin Prasanth](https://www.linkedin.com/in/libinprasanth/). Connect on LinkedIn for updates and discussion.
