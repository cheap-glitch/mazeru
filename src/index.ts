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
 * A configurable deep merging utility for JSON objects.
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

export interface MergeOptions {
	concatArrays:   boolean,
	onlyCommonKeys: boolean,
	excludedKeys:   Array<string>,
	allowedKeys?:   Array<string>,
	keysFilter:     (key: string, baseValue: JsonValue, mixedValue?: JsonValue) => boolean,
}

type MergeResult<B extends JsonValue, M extends JsonValue> = [B] extends JsonObject ? [M] extends JsonObject ? Merge<B, M> : M : M;

export function merge<B extends JsonValue, M extends JsonValue>(base: B, mixed: M, userOptions: Partial<MergeOptions> = {}): MergeResult<B, M> {
	const options: MergeOptions = {
		concatArrays:   false,
		onlyCommonKeys: false,
		excludedKeys:   [],
		keysFilter:     () => true,
		...userOptions,
	};

	if (isJsonArray(base) && isJsonArray(mixed) && options.concatArrays) {
		return base.concat(mixed) as B & M;
	}

	if (!isJsonObject(base) || !isJsonObject(mixed)) {
		return mixed;
	}

	const result: JsonObject = {};
	for (const [key, baseValue] of Object.entries(base)) {
		if (baseValue === undefined) {
			continue;
		}

		const mixedValue = mixed[key];

		if (options.excludedKeys.includes(key) || (options.allowedKeys !== undefined && !options.allowedKeys.includes(key))) {
			continue;
		}
		if (!options.keysFilter(key, baseValue, mixedValue)) {
			continue;
		}

		if (mixedValue === undefined) {
			if (!options.onlyCommonKeys) {
				result[key] = baseValue;
			}
			continue;
		}

		result[key] = merge(baseValue, mixedValue, options);
	}

	return result as Merge<B, M>;
}

function isJsonArray(value: JsonValue): value is JsonArray {
	return Array.isArray(value);
}

function isJsonObject(value: JsonValue): value is JsonObject {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}
