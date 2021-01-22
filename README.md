<div align="center">
	<img alt="Mazeru" src"/docs/banner.png">
	<img alt="License" src="https://badgen.net/github/license/cheap-glitch/mazeru?color=green">
	<img alt="Latest release" src="https://badgen.net/github/release/cheap-glitch/mazeru?color=green">
	<a href="https://coveralls.io/github/cheap-glitch/mazeru?branch=main"><img alt="Coverage status" src="https://coveralls.io/repos/github/cheap-glitch/mazeru/badge.svg?branch=main"></a>
</div>

```typescript
import { merge } from 'mazeru';

merge({
	foo: true,
	bar: {
		a: 'foo',
		c: [0, 1]
	}
}, {
	bar: {
		a: 'bar',
		b: false,
		c: [2, 3, 4, 5],
	}
}, {
	arrays: 'append',
	excludeKeys: ['b'],
});
// {
// 	foo: true,
// 	bar: {
// 		a: 'bar',
// 		c: [0, 1, 2, 3, 4, 5]
// 	}
// }
```

**mazeru** ([混ぜる](https://jisho.org/word/%E6%B7%B7%E3%81%9C%E3%82%8B))
is a deep merging utility module aimed at JSON-compatible arrays and objects.

## Features

 * merge complex nested objects
 * allow/exclude/filter keys
 * several merge strategies for arrays (replace, append, etc.)
 * doesn't break on cyclic references
 * written in TypeScript and well-tested

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
