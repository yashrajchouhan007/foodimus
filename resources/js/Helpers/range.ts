/**
 * Returns an array with all numbers from 0 to size-1
 * @param size the size of the array to return
 * @returns the generated array
 */
export const range = (size: number) => Array.from(new Array(size).keys());

export default range;
