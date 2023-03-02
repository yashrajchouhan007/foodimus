/**
 * This styles basic body text
 */

import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";
import { ThemeColor } from "@/Theme";
import styled from "styled-components";

export default styled.div.withConfig(
  hidePropsFromHtml("size", "variant", "color", "align")
)<{
  size?: "md" | "lg" | "xl";
  variant?: "light" | "regular" | "medium" | "bold";
  color?: ThemeColor;
  align?: "left" | "center" | "right";
}>`
  text-align: ${({ align }) => (align === undefined ? "inherit" : align)};
  font-family: ${({ theme }) => theme.fonts.sans};
  font-weight: ${({ variant }) =>
    ({
      light: 300,
      regular: 400,
      medium: 500,
      bold: 600,
    }[variant || "regular"])};
  ${({ size }) =>
    ({
      "": "font-size: inherit;",
      md: "font-size: 14px;",
      lg: "font-size: 16px;",
      xl: "font-size: 19px;",
    }[size || ""])}
  ${({ color, theme }) =>
    color &&
    `
      color: ${theme.colors[color]};
    `}
`;
