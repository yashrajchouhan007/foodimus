/**
 * This is a container that is easy to resize and will cover itself with an image
 * The image will resize
 */
import styled from "styled-components";
import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";
import getSize, { Size } from "@/Helpers/size";
import responsive, { Responsive } from "@/Helpers/responsive";
import { ThemeColor } from "@/Theme";

export const ResizeableImage = styled.div.withConfig(
  hidePropsFromHtml("height", "width", "src", "focus", "color")
)<{
  height?: Size | Responsive<Size>;
  width?: Size | Responsive<Size>;
  src?: string;
  color: ThemeColor;
  focus?: [number, number];
}>`
  ${({ color, theme }) => color && `background-color: ${theme.colors[color]};`}
  ${({ src }) => src && `background: url("${src}");`}
    background-size: cover;
  ${({ focus }) =>
    focus
      ? `background-position: ${focus[0] * 100}% ${focus[1] * 100}%;`
      : "background-position: center;"}
  ${({ height }) => height && responsive(height, (o) => getSize("height", o))}
  ${({ width }) => width && responsive(width, (o) => getSize("width", o))}
`;
export default ResizeableImage;
