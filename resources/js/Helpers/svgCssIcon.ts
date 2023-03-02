import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

/**
 * Generates a css URL for a FontAwesome icon definition in a given color
 * @param definition The IconDefinition
 * @param color The color
 * @returns A css `url(...)` value
 */
export const svgCssIcon = (
  { icon: [width, height, _ligatures, _unicode, svgPathData] }: IconDefinition,
  color?: string
) => {
  let svg = "data:image/svg+xml,";
  svg += "%3Csvg xmlns='http://www.w3.org/2000/svg' ";
  svg += "aria-hidden='true' ";
  svg += "focusable='false' ";
  svg += "data-prefix='fab' ";
  svg += "class='svg-inline--fa fa-w-14 fa-sm ' ";
  svg += "role='img' ";
  svg += `viewBox='0 0 ${width} ${height}' `;
  svg += "%3E";
  svg += `%3Cpath fill='${
    color ? encodeURIComponent(color) : "currentColor"
  }' d='${svgPathData}'%3E%3C/path%3E`;
  svg += "%3C/svg%3E";
  return `url("${svg}")`;
};
export default svgCssIcon;
