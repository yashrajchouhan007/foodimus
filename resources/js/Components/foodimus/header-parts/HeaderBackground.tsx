/**
 * This component renders a rounded block filled with an image or a solid color with an optional darkening overlay.
 */
import styled from "styled-components";
import RoundedHeader from "../RoundedHeader";
import breakpoints from "@/Theme/breakpoints";
import size, { Size } from "@/Helpers/size";
import responsive, { Responsive } from "@/Helpers/responsive";
import { ThemeColor } from "@/Theme";
import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";

type Props = {
  background?: string; // The URL of the background image
  backgroundColor?: ThemeColor; // The background color, only visible if there's no background image
  overlay?: number; // An opacity for the darkening overlay (between 0 and 1)
  focus?: [number, number]; // The focus point of the image as an [x, y] array of numbers between 0 and 1, [0, 0] being the top left and [1, 1] being the bottom right
  color?: string; // Color for any text contained in the header
  height?: Responsive<Size>; // The height of the block as a responsive object
};

// Note that this styles RoundedHeader, which in turn ensures we have a box that's clipped to the correct shape
export default styled(RoundedHeader).withConfig(
  hideProps(
    "background",
    "backgroundColor",
    "overlay",
    "focus",
    "color",
    "height"
  )
)<Props>`
  position: absolute;
  overflow: hidden;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 0;
  ${(props) => props.background && `background: ${props.background};`}
  ${({ backgroundColor, theme }) =>
    backgroundColor && `background-color: ${theme.colors[backgroundColor]};`}
  background-size: cover;
  color: ${(props) => props.color || props.theme.colors.white};
  ${({ height }) => height && responsive(height, (o) => size("height", o))}
  ${(props) =>
    props.focus
      ? `background-position: ${props.focus[0] * 100}% ${
          props.focus[1] * 100
        }%;`
      : "background-position: center;"}

  padding-top: 144px;
  @media ${breakpoints.tablet} {
    padding-top: 81px;
  }
  ${(props) =>
    props.overlay &&
    `
    :after{
      content: "";
      position:absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      z-index: 1;
      background-color:black;
      opacity: ${props.overlay}
    }
    *{
      z-index: 2;
    }
    `}
`;
