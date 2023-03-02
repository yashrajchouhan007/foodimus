export type Size = string | number | undefined;
/**
 * Converts a size to css
 * @param key the css property name
 * @param size the size definition
 * @returns css
 */
export const size = (key: string, size: Size) => {
  return `${key}: ${getSizeOnly(size)};`;
};
export const getSizeOnly = (size: Size) => {
  if (size === undefined) return `0`;
  if (typeof size === "number") return `${size}px`;
  return `${size}`;
};

export default size;
