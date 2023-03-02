/**
 * This component positions the header content for a meal page
 */

import breakpoints from "@/Theme/breakpoints";
import React from "react";
import styled from "styled-components";
import Grid, { GridItem } from "../Grid";

const StyledContainer = styled(Grid).attrs(() => ({
  cols: ["auto", 1],
  areas: [
    { name: "icon", start: [0, 0], end: [0, 0] },
    { name: "title", start: [0, 1], end: [1, 1] },
    { name: "subtitle", start: [1, 0], end: [1, 0] },
  ],
}))`
  align-items: center;
  margin-top: auto;
  gap: 10px;
  font-family: ${(props) => props.theme.fonts.control};
  margin-bottom: 100px;
  @media ${breakpoints.tablet} {
    margin-bottom: 173px;
    gap: 20px;
  }

  .title,
  .subtitle {
    user-select: none;
    pointer-events: none;
  }

  .title {
    font-family: ${(props) => props.theme.fonts.controlBold};
    font-size: 37px;
    line-height: 37px;
    @media ${breakpoints.tablet} {
      font-size: 45px;
      line-height: 45px;
    }
  }
  .subtitle {
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
};
export const MealHeaderTitle = ({ icon, title, subtitle }: Props) => (
  <StyledContainer>
    {!!icon && (
      <GridItem className="icon" area="icon">
        {icon}
      </GridItem>
    )}
    {!!title && (
      <GridItem className="title" area="title">
        {title}
      </GridItem>
    )}
    {!!subtitle && (
      <GridItem className="subtitle" area="subtitle">
        {subtitle}
      </GridItem>
    )}
  </StyledContainer>
);

export default MealHeaderTitle;
