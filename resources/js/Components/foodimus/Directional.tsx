/**
 * A directional control, like the one used for the carousel
 */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { definition as faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";
import { definition as faChevronLeft } from "@fortawesome/free-solid-svg-icons/faChevronLeft";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import React, { MouseEventHandler } from "react";
import styled from "styled-components";
import { ThemeColor } from "@/Theme";
import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";

// This is a single button that has either a left or a right arrow icon
const StyledButton = styled.button.withConfig(hidePropsFromHtml("color"))<{
  color?: ThemeColor;
}>`
  color: ${(props) => props.theme.colors[props.color || "dark"]};
  text-align: center;
  font-size: 18px;
  height: 44px;
  width: 48px;
  padding-top: 2px;
  background-color: ${(props) => props.theme.colors.white};
  transition: background-color 100ms linear;
  @media (hover: hover) {
    &:hover {
      background-color: ${(props) => props.theme.colors.light};
    }
  }

  &:active {
    background-color: ${(props) => props.theme.colors.lightD10};
  }
`;

// The container wraps two buttons and applies the border radius and box shadow
const StyledContainer = styled.div`
  overflow: hidden;
  align-self: flex-start;
  display: inline-block;
  border-radius: 10px;
  box-shadow: -1px 1px 2px #00000012;
`;

type DirectionalButtonProps = React.ComponentProps<typeof StyledButton> & {
  children: IconDefinition;
};
type DirectionalProps = React.ComponentProps<typeof StyledContainer> & {
  onClickLeft?: MouseEventHandler;
  onClickRight?: MouseEventHandler;
};

export const DirectionalButton = ({
  children,
  ...p
}: DirectionalButtonProps) => {
  return (
    <StyledButton {...p}>
      <FontAwesomeIcon icon={children} />
    </StyledButton>
  );
};

/**
 * A styled dual button directional control component
 */
export const Directional = ({
  onClickLeft,
  onClickRight,
  children,
  ...p
}: DirectionalProps) => {
  return (
    <StyledContainer {...p}>
      <DirectionalButton onClick={onClickLeft}>
        {faChevronLeft}
      </DirectionalButton>
      <DirectionalButton onClick={onClickRight}>
        {faChevronRight}
      </DirectionalButton>
      {children}
    </StyledContainer>
  );
};

export default Directional;
