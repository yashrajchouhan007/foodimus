/**
 * This component renders the colored circle that contains a meal icon on the meal pages
 */

import styled from "styled-components";
import breakpoints from "@/Theme/breakpoints";
import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";

export default styled.div.withConfig(
  hidePropsFromHtml("size", "color", "themeColor")
)<{
  size?: "big";
  color?: string;
  themeColor?: string;
}>`
  position: relative;
  border-radius: 9999px;
  ${(props) => props.color && `background-color: ${props.color};`}
  ${(props) =>
    props.themeColor &&
    `background-color: ${props.theme.colors[props.themeColor]};`}
  display:flex;
  align-items: center;
  justify-content: center;
  svg {
    position: absolute;
    left: 25%;
    top: 25%;
    width: 50%;
  }
  ${(props) =>
    (props.size === undefined || props.size === "big") &&
    `
  width:36px;
  height:36px;
  @media ${breakpoints.tablet}{
    width:54px;
    height:54px;
  }
  `}
`;
