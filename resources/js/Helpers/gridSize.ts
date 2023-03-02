import range from "./range";

export type GridSize = undefined | number | (number | string)[];
/**
 * Converts grid row or column size specifications to css
 * @param key the css property name
 * @param sizes the size definition
 * @returns css
 */
export const gridSize = (key: string, sizes: GridSize) => {
  if (sizes === undefined) return `${key}: auto;`;
  if (typeof sizes === "number")
    return `${key}: ${range(sizes)
      .map(() => "1fr")
      .join(" ")};`;

  return `${key}: ${sizes
    .map((size) => {
      if (typeof size === "number") return `${size}fr`;
      return size;
    })
    .join(" ")};`;
};

export default gridSize;
