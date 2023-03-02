/**
 * An icon for a type of meal (breakfast, lunch, dinner, snack)
 */

import React from "react";
import styled from "styled-components";
import breakpoints from "@/Theme/breakpoints";
import { ThemeColor } from "@/Theme";

import CroissantIcon from "-!react-svg-loader!@img/croissant.svg";
import AppleIcon from "-!react-svg-loader!@img/apple.svg";
import BurgerIcon from "-!react-svg-loader!@img/burger.svg";
import DinnerIcon from "-!react-svg-loader!@img/dinner.svg";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";

export const StyledMealIcon = styled.div.withConfig(
  hidePropsFromHtml("size", "color", "themeColor")
)<{
  size?: "big" | "medium";
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
  color: white;
  svg {
    position: absolute;
    width: 50%;
    height: initial;
  }
  .fa-icon {
    position: absolute;
    width: 40%;
    height: initial;
  }
  ${(props) =>
    props.size === "medium" &&
    `
    width:29px;
    height:29px;
    `}
  ${(props) =>
    (props.size === undefined || props.size === "big") &&
    `
    width:41px;
    height:41px;
    @media ${breakpoints.tablet}{
      width:45px;
      height:45px;
    }
    `}
`;

export const MealIconDef = ({ icon }: { icon: MealIconName }) =>
  ({
    croissant: <CroissantIcon />,
    burger: <BurgerIcon />,
    apple: <AppleIcon />,
    dinner: <DinnerIcon />,
    none: <svg />,
  }[icon]);

export type MealIconName = "none" | "croissant" | "burger" | "apple" | "dinner";
type MealIconProps = {
  color: ThemeColor;
  size?: "big" | "medium";
} & ({ icon: MealIconName } | { faIcon: IconProp });
export const MealIcon = ({ color, size, ...p }: MealIconProps) => (
  <StyledMealIcon size={size} themeColor={color}>
    {(p as any).icon ? (
      <MealIconDef icon={(p as any).icon} />
    ) : (
      <FontAwesomeIcon className="fa-icon" icon={(p as any).faIcon} />
    )}
  </StyledMealIcon>
);
export default MealIcon;
