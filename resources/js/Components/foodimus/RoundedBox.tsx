import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";
import { ThemeColor } from "@/Theme";
import styled from "styled-components";

const size = (value: number | string) =>
  typeof value === "number" ? `${value}px` : value;

export default styled.div.withConfig<{
  width?: number | string;
  height?: number | string;
  shadow?: "normal" | "big";
  color?: ThemeColor;
  textColor?: ThemeColor;
}>(hidePropsFromHtml("width", "height", "shadow", "color", "textColor"))`
  overflow: hidden;
  background-color: ${({ theme, color }) => theme.colors[color || "white"]};
  ${({ theme, textColor }) => textColor && `color: ${theme.colors[textColor]};`}
  ${({ shadow }) =>
    (shadow === undefined || shadow === "normal") &&
    `box-shadow: 2px 3px 6px #0000000a;`}
  ${({ shadow }) => shadow === "big" && `box-shadow: -1px 0px 6px #00000027;`}
  border-radius: 5px;
  ${({ width }) => width && `width: ${size(width)};`}
  ${({ height }) => height && `height: ${size(height)};`}
`;
