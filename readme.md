This a helper library for emitting Webassembly module instances at runtime
from JavaScript/TypeScript. In essence, it is the [helper from v8's test
suite](https://github.com/v8/v8/blob/master/test/mjsunit/wasm/wasm-module-builder.js) ported to TypeScript.

Currently, you can find basic usage examples in the work-in-progress
[test suite](src/webassembly-jit.test.ts).

This package is under development and it will break (or it may be abandoned).