/**
 * A container for popup menus and items that go in it.
 */
import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";
import React from "react";
import styled from "styled-components";

export const PopupMenuItem = styled.button.withConfig<{
  separators?: boolean;
}>(hidePropsFromHtml("separators"))`
  display: flex;
  align-items: center;
  height: 55px;
  padding: 0 20px;
  position: relative;
  margin-bottom: -1px;
  transition: background-color 100ms linear;
  background-color: ${(props) => props.theme.colors.white};
  &:not(:last-child):after {
    content: "";
    display: block;
    position: absolute;
    background-color: ${(props) => props.theme.colors.purpleL60};
    bottom: 0;
    height: 1px;
    left: 20px;
    right: 20px;
    z-index: -1;
  }
  @media (hover: hover) {
    &:hover {
      background-color: ${(props) => props.theme.colors.purpleL70};
    }
  }
  &:active {
    background-color: ${(props) => props.theme.colors.purpleL50};
  }
  ${({ separators, theme }) =>
    separators &&
    `
  :not(:last-child) {
    &:after {
      content: "";
      display: block;
      position: absolute;
      bottom: 0;
      left: 20px;
      right: 20px;
      height: 1px;
      background-color: ${theme.colors.purpleA15};
      z-index: 1;
    }
  }
  `}
`;
export const StyledPopupMenu = styled.div.withConfig<{
  show?: boolean;
  nostyle?: boolean;
}>(hidePropsFromHtml("show", "nostyle"))`
  display: ${(props) => (props.show ? "flex" : "none")};
  flex-direction: column;
  position: absolute;
  z-index: 100;
  ${({ nostyle, theme }) =>
    !nostyle &&
    `
  box-shadow: 0px 7px 20px #00000021;
  min-width: 230px;
  border: 1px solid ${theme.colors.purpleL60};
  border-radius: 10px;
  overflow: hidden;
  `}
`;
const PopupMenuContainer = styled.div`
  position: relative;
`;

type Props = React.ComponentProps<typeof StyledPopupMenu> & {
  nostyle?: boolean;
  className?: string;
};
export const PopupMenu = ({ className, ...p }: Props) => (
  <PopupMenuContainer className={className}>
    <StyledPopupMenu className="inner" {...p} />
  </PopupMenuContainer>
);

export default PopupMenu;
