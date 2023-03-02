/**
 * This component renders the user's avatar in the top right corner of the header
 */
import styled, { css } from "styled-components";
import breakpoints from "@/Theme/breakpoints";
import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";

export default styled.div.withConfig(
  hidePropsFromHtml("size", "color", "themeColor", "flipped")
)<{
  size?: "big";
  color?: string;
  themeColor?: string;
  flipped?: boolean;
}>`
  position: relative;
  border-radius: 9999px;
  ${(props) => props.color && `background-color: ${props.color};`}
  ${(props) =>
    props.themeColor &&
    `background-color: ${props.theme.colors[props.themeColor]};`}
  ${({ onClick }) =>
    !!onClick &&
    css`
      pointer-events: initial;
      cursor: pointer;
    `}
  display:flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  img {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    ${({ flipped }) => flipped && `transform: scale(-1 1);`}
  }
  ${(props) =>
    (props.size === undefined || props.size === "big") &&
    `
  width:48px;
  height:48px;
  @media ${breakpoints.tablet}{
    margin: 0 5px;
    width:100px;
    height:100px;
  }
  `}
`;
