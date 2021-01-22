<h1 align="center">
	<img alt="Mazeru" src="/docs/banner.png">
</h1>
<p align="center">
	<img alt="License" src="https://badgen.net/github/license/cheap-glitch/mazeru?color=green">
	<img alt="Latest release" src="https://badgen.net/github/release/cheap-glitch/mazeru?color=green">
	<a href="https://coveralls.io/github/cheap-glitch/mazeru?branch=main"><img alt="Coverage status" src="https://coveralls.io/repos/github/cheap-glitch/mazeru/badge.svg?branch=main"></a>
</p>

**mazeru** ([混ぜる](https://jisho.org/word/%E6%B7%B7%E3%81%9C%E3%82%8B))
is a deep merging utility module aimed at JSON-compatible arrays and objects.

```typescript
import { merge } from 'mazeru';

merge({
	foo: true,
	bar: { a: 'foo', b: [0, 1] },
}, {
	bar: { a: 'bar', b: [2, 3, 4, 5], c: false },
	baz: [],
}, {
	arrays: 'append',
	excludeKeys: ['baz', 'c'],
});
// {
// 	foo: true,
// 	bar: { a: 'bar', b: [0, 1, 2, 3, 4, 5] },
// }
```

## Features

 * Merge complex nested objects
 * Allow/exclude/filter keys
 * Several merge strategies for arrays (replace, append, etc.)
 * Doesn't break on cyclic references
 * Written in TypeScript and well-tested

## Installation

```shell
npm i mazeru
```

## API

## License

```text
Copyright (c) 2021-present, cheap glitch

Permission to use, copy, modify, and/or distribute this software for any purpose
with or without fee is hereby  granted, provided that the above copyright notice
and this permission notice appear in all copies.

THE SOFTWARE  IS PROVIDED "AS IS"  AND THE AUTHOR DISCLAIMS  ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING  ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS.  IN NO  EVENT  SHALL THE  AUTHOR  BE LIABLE  FOR  ANY SPECIAL,  DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
OF USE, DATA OR  PROFITS, WHETHER IN AN ACTION OF  CONTRACT, NEGLIGENCE OR OTHER
TORTIOUS ACTION, ARISING OUT OF OR IN  CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.
```
