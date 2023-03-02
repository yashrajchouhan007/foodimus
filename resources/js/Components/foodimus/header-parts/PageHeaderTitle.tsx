/**
 * This component positions the header content for a picture header (like the one used on the search page)
 */
import breakpoints from "@/Theme/breakpoints";
import React from "react";
import styled from "styled-components";
import Grid, { GridItem } from "../Grid";

const StyledContainer = styled(Grid).attrs(() => ({
  areas: [
    { name: "title", start: [0, 0], end: [0, 0] },
    { name: "subtitle", start: [0, 1], end: [0, 1] },
  ],
}))`
  align-items: center;
  margin-top: auto;
  gap: 10px;
  font-family: ${(props) => props.theme.fonts.control};
  margin-bottom: 50px;
  @media ${breakpoints.tablet} {
    margin-bottom: 150px;
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
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
};
export const PageHeaderTitle = ({ title, subtitle }: Props) => (
  <StyledContainer>
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

export default PageHeaderTitle;
