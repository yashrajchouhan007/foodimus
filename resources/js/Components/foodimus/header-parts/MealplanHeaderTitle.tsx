/**
 * This component positions the header content for a meal plan page
 */
import breakpoints from "@/Theme/breakpoints";
import React from "react";
import styled from "styled-components";
import Grid, { GridItem } from "../Grid";

const StyledContainer = styled(Grid).attrs(() => ({
  cols: ["auto", 1],
  areas: {
    "default": [
      { name: "icon", start: [0, 0], end: [0, 0] },
      { name: "subtitle", start: [1, 0], end: [1, 0] },
      { name: "title", start: [0, 1], end: [1, 1] },
      { name: "button", start: [0, 2], end: [1, 2] },
    ],
    tablet: [
      { name: "icon", start: [0, 0], end: [0, 0] },
      { name: "subtitle", start: [0, 1], end: [0, 1] },
      { name: "title", start: [0, 2], end: [0, 2] },
      { name: "button", start: [0, 3], end: [0, 3] },
    ],
  },
}))`
  align-items: center;
  margin-top: auto;
  gap: 10px;
  font-family: ${(props) => props.theme.fonts.control};
  margin-bottom: 60px;
  @media ${breakpoints.tablet} {
    margin-bottom: 120px;
    gap: 20px;
  }
  .icon,
  .title,
  .subtitle {
    user-select: none;
    pointer-events: none;
    cursor: pointer;
    &.clickable {
      pointer-events: initial;
      cursor: pointer;
    }
  }
  .title {
    pointer-events: none;
    font-family: ${(props) => props.theme.fonts.controlBold};
    font-size: 37px;
    line-height: 37px;
    max-width: 90%;
    @media ${breakpoints.tablet} {
      max-width: initial;
      font-size: 45px;
      line-height: 45px;
    }
  }
  .subtitle {
    pointer-events: none;
    font-size: 16px;
    line-height: 16px;
    @media ${breakpoints.tablet} {
      font-size: 25px;
      line-height: 25px;
    }
  }
  .subtitle strong {
    font-family: ${(props) => props.theme.fonts.controlBold};
    font-weight: initial;
  }
`;

type Props = React.ComponentProps<typeof StyledContainer> & {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  button?: React.ReactNode;
  onClickIcon?: () => void;
  onClickTitle?: () => void;
  onClickSubtitle?: () => void;
};
export const MealplanHeaderTitle = ({
  icon,
  title,
  subtitle,
  button,
  onClickIcon,
  onClickTitle,
  onClickSubtitle,
  ...p
}: Props) => (
  <StyledContainer {...p}>
    {!!icon && (
      <GridItem
        onClick={onClickIcon}
        className={"icon" + (onClickIcon ? " clickable" : "")}
        area="icon"
      >
        {icon}
      </GridItem>
    )}
    {!!title && (
      <GridItem
        onClick={onClickTitle}
        className={"title" + (onClickTitle ? " clickable" : "")}
        area="title"
      >
        {title}
      </GridItem>
    )}
    {!!subtitle && (
      <GridItem
        onClick={onClickSubtitle}
        className={"subtitle" + (onClickSubtitle ? " clickable" : "")}
        area="subtitle"
      >
        {subtitle}
      </GridItem>
    )}
    {!!button && (
      <GridItem className="button" area="button">
        {button}
      </GridItem>
    )}
  </StyledContainer>
);

export default MealplanHeaderTitle;
