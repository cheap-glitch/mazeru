import { JsonValue, JsonObject } from 'type-fest';

import merge from '../src/index';
import { MergingStrategy } from '../src/index';

test('merging primitives', () => { // {{{

	expect(merge(null, null)).toBeNull();
	expect(merge(2, null)).toBeNull();

	expect(merge(2, 3)).toEqual(3);
	expect(merge(2, '2')).toEqual('2');
	expect(merge('foo', 'bar')).toEqual('bar');

}); // }}}

test('merging arrays', () => { // {{{

	expect(merge(null,  [])).toEqual([]);
	expect(merge(2,     [])).toEqual([]);
	expect(merge('foo', [])).toEqual([]);

	expect(merge([null],    [null])).toEqual([null]);
	expect(merge(['2'],     [2])).toEqual([2]);
	expect(merge([2],       ['2'])).toEqual(['2']);
	expect(merge([0, 1, 2], [3])).toEqual([3]);
	expect(merge([{}],      [])).toEqual([]);

	expect(merge([null],    [null], { arrays: MergingStrategy.Concatenate })).toEqual([null, null]);
	expect(merge(['2'],     [2],    { arrays: MergingStrategy.Concatenate })).toEqual(['2', 2]);
	expect(merge([2],       ['2'],  { arrays: MergingStrategy.Concatenate })).toEqual([2, '2']);
	expect(merge([0, 1, 2], [3],    { arrays: MergingStrategy.Append })).toEqual([0, 1, 2, 3]);
	expect(merge([{}],      [],     { arrays: MergingStrategy.Append })).toEqual([{}]);
	expect(merge([],        [{}],   { arrays: MergingStrategy.Append })).toEqual([{}]);

	expect(merge([],               [true, 0],        { arrays: MergingStrategy.MergeItems })).toEqual([true, 0]);
	expect(merge([false],          [true, 0],        { arrays: MergingStrategy.MergeItems })).toEqual([true, 0]);
	expect(merge([1, 0],           [0],              { arrays: MergingStrategy.MergeItems })).toEqual([0, 0]);
	expect(merge([{ foo: 'bar' }], [{ bar: 'foo' }], { arrays: MergingStrategy.MergeItems })).toEqual([{ foo: 'bar', bar: 'foo' }]);
	expect(merge([0],              [{ bar: 'foo' }], { arrays: MergingStrategy.MergeItems })).toEqual([{ bar: 'foo' }]);
	expect(merge([{ foo: 'bar' }], [0],              { arrays: MergingStrategy.MergeItems })).toEqual([0]);
	expect(merge([{ foo: 'bar' }], [0, 'foo'],       { arrays: MergingStrategy.MergeItems })).toEqual([0, 'foo']);

}); // }}}

test('merging objects', () => { // {{{

	expect(merge({}, {})).toEqual({});

	expect(merge({ foo: 1 }, { bar: 2 })).toEqual({ foo: 1, bar: 2 });
	expect(merge({ foo: 1 }, { foo: 2 })).toEqual({ foo: 2 });

	expect(merge({ foo: { bar: true } }, {},                      {})).toEqual({ foo: { bar: true } });
	expect(merge({ foo: { bar: true } }, { foo: 'bar' },          {})).toEqual({ foo: 'bar' });
	expect(merge({ foo: { bar: true } }, { foo: { bar: false } }, {})).toEqual({ foo: { bar: false } });
	expect(merge({ foo: { bar: true } }, { foo: { baz: 0 } },     {})).toEqual({ foo: { bar: true, baz: 0 } });

	expect(merge({ foo: { bar: true, baz: { foo: 'bar' } } }, { foo: { baz: { bar: 'foo' } } })).toEqual({ foo: { bar: true, baz: { foo: 'bar', bar: 'foo' } } });

	expect(merge({ foo: [0, 1] }, { foo: [2, 3] }, { arrays: MergingStrategy.Append     })).toEqual({ foo: [0, 1, 2, 3] });
	expect(merge({ foo: [0, 1] }, { foo: [2, 3] }, { arrays: MergingStrategy.MergeItems })).toEqual({ foo: [2, 3] });

}); // }}}

test('merging objects with circular references', () => { // {{{

	// Self-reference
	const foo: JsonObject = {};
	foo.foo = foo;

	// Test
	expect(merge(foo, foo)).toEqual({ foo: {} });

	// Mirrored references
	const a: JsonObject = {};
	const b: JsonObject = {};
	a.b = b;
	b.a = a;

	// Test
	expect(merge(a, b)).toEqual({ b: { a: {} } });

	// Reference loop
	const x: JsonObject = {};
	const y: JsonObject = {};
	const z: JsonObject = {};
	x.foo = y;
	y.foo = z;
	z.foo = x;

	// Test
	expect(merge(x, {})).toEqual({ foo: { foo: { foo: {} } } });
	expect(merge({}, x)).toEqual({ foo: { foo: { foo: {} } } });

	// Multiple non-circular references
	const bar: JsonObject = {};

	// Test
	expect(merge({ a: bar, b: bar, c: false }, { c: bar, d: bar })).toEqual({ a: bar, b: bar, c: bar, d: bar });

}); // }}}

test('filtering keys', () => { // {{{

	expect(merge({ foo: true }, { bar: true },                   { onlyCommonKeys: true })).toEqual({});
	expect(merge({ foo: { bar: true } }, { bar: true },          { onlyCommonKeys: true })).toEqual({});
	expect(merge({ foo: { bar: true } }, { bar: { foo: true } }, { onlyCommonKeys: true })).toEqual({});
	expect(merge({ foo: true, bar: false }, { bar: true },       { onlyCommonKeys: true })).toEqual({ bar: true });

	expect(merge({ foo: true }, { bar: true },          { excludeKeys: ['foo', 'bar'] })).toEqual({});
	expect(merge({ foo: true }, { bar: true },          { excludeKeys: ['foo'] })).toEqual({ bar: true });
	expect(merge({ foo: true }, { bar: true },          { excludeKeys: ['bar'] })).toEqual({ foo: true });
	expect(merge({ foo: { bar: true } }, { bar: true }, { excludeKeys: ['foo'] })).toEqual({ bar: true });
	expect(merge({ foo: { bar: true } }, { bar: true }, { excludeKeys: ['bar'] })).toEqual({ foo: {} });

	expect(merge({ foo: true }, { bar: true },          { allowKeys: [] })).toEqual({});
	expect(merge({ foo: true }, { bar: true },          { allowKeys: ['foo', 'bar'] })).toEqual({ foo: true, bar: true });
	expect(merge({ foo: true }, { bar: true },          { allowKeys: ['foo'] })).toEqual({ foo: true });
	expect(merge({ foo: true }, { bar: true },          { allowKeys: ['bar'] })).toEqual({ bar: true });
	expect(merge({ foo: { bar: true } }, { bar: true }, { allowKeys: ['foo'] })).toEqual({ foo: {} });
	expect(merge({ foo: { bar: true } }, { bar: true }, { allowKeys: ['bar'] })).toEqual({ bar: true });

	expect(merge({
		foo: true,
		bar: [{}, {}],
		baz: 'baz',
		boo: { baz: 6 },
	}, {
		bar: false,
		baz: 'baz',
		boo: { baz: null },
	}, {
		keysFilter(key: string, baseValue?: JsonValue, mixedValue?: JsonValue): boolean {
			if (Array.isArray(baseValue)) {
				return false;
			}
			if (key.endsWith('z')) {
				return mixedValue === null;
			}

			return true;
		},
	})).toEqual({
		foo: true,
		boo: { baz: null },
	});

}); // }}}
