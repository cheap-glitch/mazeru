![Mazeru, written in Japanase characters filled with blue and red swirls of paint.](docs/logo-small.png)

[![License](https://shields.io/github/license/cheap-glitch/mazeru)](LICENSE)
[![Latest release](https://shields.io/github/v/release/cheap-glitch/mazeru?sort=semver&label=latest%20release&color=green)](https://github.com/cheap-glitch/mazeru/releases/latest)
[![Coverage status](https://shields.io/coveralls/github/cheap-glitch/mazeru)](https://coveralls.io/github/cheap-glitch/mazeru)

**mazeru** ([混ぜる](https://jisho.org/word/%E6%B7%B7%E3%81%9C%E3%82%8B))
is a deep merging utility module, aimed at JSON-compatible arrays and objects.

## Features

 * Merge complex nested objects & arrays
 * Allow/exclude/filter keys
 * Several merge strategies for arrays (replace, append, etc.)
 * Doesn't break on cyclic references
 * Written in TypeScript and well-tested

## Installation

```
npm i mazeru
```

## Usage

```javascript
const merge = require('mazeru');

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

// 	foo: true,
// 	bar: { a: 'bar', b: [0, 1, 2, 3, 4, 5] },
```

## API

### merge(base: JsonValue, mixed: JsonValue, options?: MergeOptions): JsonValue

Merge `mixed` into `base`.

If at least one of the passed value is a primitive, the return value will simply
be `mixed`.

If both  are arrays, the  return value will depend  on the `arrays`  option (see
below for more infos).

Finally, if both are objects, they will be merged recursively. In the case of as
conflict between two keys at the same level with the same name, the value of the
key in `mixed` will always prevail.

### Options

#### `arrays`: replace | append | concat | merge

Default: `replace`

The strategy used to handle two conflicting arrays:
 * `replace` (default): simply replace the first array with the second one
 * `append`, `concat`: append the second array to the first one
 * `merge`: merge each pair of matching  items, adding any excess items at the
 end  (this  is  only  really  useful  when the  items  are  arrays  or  objects
 themselves)

#### `onlyCommonKeys`: boolean

Default: `false`

Only keep the keys that present in  both objects. This applies to nested objects
as well.

#### `excludeKeys`: string[]

Default: `[]`

Exclude the listed keys from the resulting merged object.

#### `allowKeys`: string[]

Default: `undefined`

Only allow the listed keys in the resulting merged object.

#### `keysFilter`: (key: string, baseValue?: JsonValue, mixedValue?: JsonValue) => boolean

Default: `() => true`

Filter keys in the resulting merged object using the provided sieve.

## Changelog

See the full changelog [here](https://github.com/cheap-glitch/mazeru/releases).

## Contributing

Contributions are welcomed! Please open an issue before submitting substantial changes.

## Related

 * [`deepmerge`](https://github.com/TehShrike/deepmerge) – A library for deep (recursive) merging of JavaScript objects
 * [`deepmerge-ts`](https://github.com/RebeccaStevens/deepmerge-ts) – Deeply merge 2 or more objects respecting type information
 * [`flatted`](https://github.com/WebReflection/flatted) – Fast and minimal circular JSON parser

## License

ISC
