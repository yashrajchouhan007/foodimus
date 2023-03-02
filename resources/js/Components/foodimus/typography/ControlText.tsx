/**
 * This styles text as it's shown on a control
 */

import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";
import { ThemeColor } from "@/Theme";
import styled from "styled-components";

export default styled.div.withConfig(
  hidePropsFromHtml("size", "variant", "color")
)<{
  size?: "md" | "lg" | "xl";
  variant?: "regular" | "medium" | "bold";
  color?: ThemeColor;
}>`
  font-family: ${({ theme, variant }) =>
    ({
      regular: theme.fonts.control,
      medium: theme.fonts.controlMedium,
      bold: theme.fonts.controlBold,
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
