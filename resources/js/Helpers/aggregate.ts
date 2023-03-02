export type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

/**
 * Selects a key from an array and aggregates it
 * @param array the input array
 * @param key the key to select
 * @param aggregator the function that processes the
 *            accumulator with an item from the array
 *            and returns the new accumulator
 * @param initial the initial accumulator. If left
 *            undefined, the first item will be used
 *            as the initial accumulator
 * @returns the final accumulator
 */
export const aggregate = <T, TVal>(
  array: T[],
  key: KeysOfType<T, TVal>,
  aggregator: (a: TVal, b: TVal) => TVal,
  initial?: TVal
) =>
  array
    .map((i) => i[key] as unknown as TVal)
    .reduce(aggregator, initial as any);

/**
 * Return the sum of a key in an array of objects
 * @param array the input array
 * @param key the key to select
 * @returns the sum of the items
 */
export const sum = <T>(array: T[], key: KeysOfType<T, number>) =>
  aggregate<T, number>(array, key, (a, b) => a + b, 0);
