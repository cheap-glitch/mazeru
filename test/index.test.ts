import { MergingStrategy, merge } from '../src/index';

test('merging primitives', () => { // {{{

	expect(merge(null, null)).toBeNull();
	expect(merge(2,    null)).toBeNull();

	expect(merge(2,     3)).toEqual(3);
	expect(merge(2,     '2')).toEqual('2');
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

	expect(merge([{ foo: 'bar' }], [{ bar: 'foo' }], { arrays: MergingStrategy.MergeItems })).toEqual([{ foo: 'bar', bar: 'foo' }]);
	expect(merge([0],              [{ bar: 'foo' }], { arrays: MergingStrategy.MergeItems })).toEqual([{ bar: 'foo' }]);
	expect(merge([{ foo: 'bar' }], [0],              { arrays: MergingStrategy.MergeItems })).toEqual([0]);

}); // }}}

test('merging objects', () => { // {{{

	expect(merge({}, {})).toEqual({});

	expect(merge({ foo: 1 }, { bar: 2 })).toEqual({ foo: 1, bar: 2 });

}); // }}}
