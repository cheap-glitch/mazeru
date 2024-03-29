/*!
 *
 * eee......eee..eeeeee..eeeeeeee.eeeeee.eeeeeee..eee..eee.
 * @@@@::::@@@@:@@@@@@@@:@@@@@@@@:@@@@@@:@@@@@@@@:@@@::@@@:
 * %%%%%--%%%%%-%%%--%%%-----%%%--%%%----%%%--%%%-%%%--%%%-
 * &&&&&&&&&&&&+&&&&&&&&++++&&&+++&&&&&++&&&&&&&++&&&++&&&+
 * |||*||||*|||*||||||||***|||****|||||**||||||***|||**|||*
 * !!!==!!==!!!=!!!==!!!==!!!=====!!!====!!!=!!!==!!!==!!!=
 * :::######:::#:::##:::#::::::::#::::::#:::##:::#::::::::#
 * ...@@@@@@...@...@@...@........@......@...@@...@@......@@
 *
 * A flexible deep merging utility for JSON-like objects.
 *
 * Copyright (c) 2021-present, cheap glitch
 *
 * Permission  to use,  copy, modify,  and/or distribute  this software  for any
 * purpose  with or  without  fee is  hereby granted,  provided  that the  above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS  SOFTWARE INCLUDING ALL IMPLIED  WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE  AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL  DAMAGES OR ANY DAMAGES  WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 * OTHER  TORTIOUS ACTION,  ARISING OUT  OF  OR IN  CONNECTION WITH  THE USE  OR
 * PERFORMANCE OF THIS SOFTWARE.
 */

import { JsonValue, JsonArray, JsonObject, Merge } from 'type-fest';

export enum MergingStrategy {
	Replace     = 'replace',
	Append      = 'append',
	Concatenate = 'concat',
	MergeItems  = 'merge',
}

interface MergeOptions {
	arrays:         MergingStrategy,
	onlyCommonKeys: boolean,
	excludeKeys:    Array<string>,
	allowKeys?:     Array<string>,
	keysFilter:     (key: string, baseValue?: JsonValue, mixedValue?: JsonValue) => boolean,
}

type MergeResult<B extends JsonValue, M extends JsonValue> = [B] extends JsonObject ? M extends JsonObject ? Merge<B, M> : M : M;

export default function merge<B extends JsonValue, M extends JsonValue>(base: B, mixed: M, userOptions: Partial<MergeOptions> = {}, visitedObjects: Array<JsonObject> = []): MergeResult<B, M> {
	const options: MergeOptions = {
		arrays:         MergingStrategy.Replace,
		onlyCommonKeys: false,
		excludeKeys:    [],
		keysFilter:     () => true,
		...userOptions,
	};

	if (isJsonArray(base) && isJsonArray(mixed)) {
		const result: JsonArray = [];
		switch (options.arrays) {
			case MergingStrategy.Replace:
				return mixed;

			case MergingStrategy.Append:
			case MergingStrategy.Concatenate:
				return base.concat(mixed) as JsonArray & B & M;

			case MergingStrategy.MergeItems:
				for (const index of [...new Array(Math.max(base.length, mixed.length)).keys()]) {
					const baseItem  = base[index];
					const mixedItem = mixed[index];

					if (baseItem !== undefined && mixedItem !== undefined) {
						result.push(merge(baseItem, mixedItem, userOptions, visitedObjects));
						continue;
					}
					if (baseItem !== undefined) {
						result.push(baseItem);
						continue;
					}
					/* istanbul ignore next */
					if (mixedItem !== undefined) {
						result.push(mixedItem);
					}
				}
				return result as JsonArray & B & M;
		}
	}

	if (!isJsonObject(base) || !isJsonObject(mixed)) {
		return mixed;
	}

	const result: JsonObject = {};
	const safeReferences: Array<JsonObject> = [];

	for (const key of new Set([...Object.keys(base), ...Object.keys(mixed)])) {
		const baseValue  = isCircularReference(base[key],  visitedObjects, safeReferences) ? undefined :  base[key];
		const mixedValue = isCircularReference(mixed[key], visitedObjects, safeReferences) ? undefined : mixed[key];

		if (options.onlyCommonKeys && (baseValue === undefined || mixedValue === undefined)) {
			continue;
		}
		if (options.excludeKeys.includes(key) || (options.allowKeys !== undefined && !options.allowKeys.includes(key))) {
			continue;
		}
		if (!options.keysFilter(key, baseValue, mixedValue)) {
			continue;
		}

		if (baseValue !== undefined && mixedValue !== undefined) {
			result[key] = merge(baseValue, mixedValue, userOptions, visitedObjects);
			continue;
		}
		if (baseValue !== undefined) {
			result[key] = isJsonObject(baseValue) ? merge(baseValue, {}, userOptions, visitedObjects) : baseValue;
			continue;
		}
		if (mixedValue !== undefined) {
			result[key] = isJsonObject(mixedValue) ? merge({}, mixedValue, userOptions, visitedObjects) : mixedValue;
		}
	}

	return result as Merge<B, M>;
}

function isCircularReference(value: JsonValue | undefined, visitedObjects: Array<JsonObject>, safeReferences: Array<JsonObject>): boolean {
	if (value === undefined || !isJsonObject(value)) {
		return false;
	}

	if (safeReferences.includes(value)) {
		return false;
	}
	if (visitedObjects.includes(value)) {
		return true;
	}

	visitedObjects.push(value);
	safeReferences.push(value);

	return false;
}

function isJsonArray(value: JsonValue): value is JsonArray {
	return Array.isArray(value);
}

function isJsonObject(value: JsonValue): value is JsonObject {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}
