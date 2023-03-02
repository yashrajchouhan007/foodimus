/**
 * A component that separates menu items visually
 */

import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";
import getSize, { Size } from "@/Helpers/size";
import { ThemeColor } from "@/Theme";
import styled from "styled-components";

export const separatorColor = "purpleA30";

export default styled.div
  .attrs((p) => ({
    className: p.className || "separator",
  }))
  .withConfig<any>(hidePropsFromHtml("color", "unsized", "size"))<{
  color?: ThemeColor;
  unsized?: boolean;
  size?: Size;
}>`
  display: block;
  background-color: ${({ theme, color }) =>
    theme.colors[color || separatorColor]};
  ${({ size }) => (size ? getSize("min-height", size) : "min-height: 1px;")}
  ${({ size }) => (size ? getSize("min-width", size) : "min-width: 1px;")}
  ${({ unsized }) =>
    !unsized &&
    `
  width: 100%;
    `}
`;
