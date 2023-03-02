import breakpoints, { size } from "@/Theme/breakpoints";

const DEFAULT_KEY = "default" as const;
export type Breakpoint = keyof typeof breakpoints;
export type ResponsiveKey = Breakpoint | typeof DEFAULT_KEY;

export type Responsive<T> = Partial<{
  [s in Breakpoint]: T;
}> & { [DEFAULT_KEY]: T };

/**
 * Check whether an input is a `Responsive<T>` object
 * @param object the object to test
 * @returns whether the object is a `Responsive<T>` object
 */
export const isResponsive = (object: any): object is Responsive<any> =>
  typeof object === "object" &&
  Object.getOwnPropertyNames(object).every((name) => {
    return (
      name === DEFAULT_KEY ||
      Object.prototype.hasOwnProperty.call(breakpoints, name)
    );
  });

/**
 * Find the responsive value for a given breakpoint
 * @param responsive
 * @param breakpoint
 * @returns
 */
export const responsiveValue = <T>(
  responsive: Responsive<T>,
  breakpoint: ResponsiveKey
): T => {
  const width = breakpoint === DEFAULT_KEY ? 0 : size[breakpoint];
  const filtered = Object.entries(responsive)
    .reverse()
    .find(([key]) => {
      if (key === "default") return true;
      const minWidth = size[key as Breakpoint];
      return key === DEFAULT_KEY ? 0 : width >= minWidth;
    });
  return filtered?.[1] as any as T;
};

/**
 * Generate responsive CSS from a `Responsive<T>` spec
 * @param responsive the spec object
 * @param generator a function that accepts `T` and returns the css for that value
 * @returns responsive CSS
 */
export const responsive = <T>(
  responsive: undefined | T | Responsive<T>,
  generator: (spec: undefined | T, breakpoint: string) => string
) => {
  if (!responsive || !isResponsive(responsive))
    return generator(responsive, "default");

  return Object.entries(responsive)
    .map(([k, v]) => {
      const css = generator(v, k);
      if (k === DEFAULT_KEY) return css;
      const query = breakpoints[k as Breakpoint];
      return `@media ${query}{ ${css} }`;
    })
    .join("\n");
};
export default responsive;
