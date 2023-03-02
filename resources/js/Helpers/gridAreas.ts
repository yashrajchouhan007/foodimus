export type GridArea = {
  name: string;
  start: [number, number];
  end?: [number, number];
};
export type GridAreas = GridArea[];
/**
 * Converts an area definition object to css
 * @param key the css property name
 * @param areas the areas definition
 * @returns css
 */
export const gridAreas = (key: string, areas?: GridAreas) => {
  if (areas === undefined) return `${key}: initial;`;

  // find the extent of the areas, so we can determine the
  // number of columns and rows in the `grid-template-areas`
  // css property
  const size = areas.reduce(
    (c, { start, end }) => {
      const [x1, y1] = start;
      const [x2, y2] = end || start;
      if (c.x < x1) c.x = x1;
      if (c.x < x2) c.x = x2;
      if (c.y < y1) c.y = y1;
      if (c.y < y2) c.y = y2;
      return c;
    },
    { x: 0, y: 0 }
  );

  // build up the css property value
  const sizes = [];
  for (let y = 0; y <= size.y; y++) {
    const row = [];
    for (let x = 0; x <= size.x; x++) {
      // do a simple 'hit test' to see if the current cell
      // hits an area, and return "." otherwise
      row.push(
        areas.find(({ start, end }) => {
          const [x1, y1] = start;
          const [x2, y2] = end || start;
          return x1 <= x && x2 >= x && y1 <= y && y2 >= y;
        })?.name || "."
      );
    }
    sizes.push(`"${row.join(" ")}"`);
  }
  const result = sizes.join(" ");
  return `${key}: ${result || "initial"};`;
};

export default gridAreas;
