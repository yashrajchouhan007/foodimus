import breakpoints, { size } from "./breakpoints";

export const mobilePageMargin = 18;
export const tabletPageMargin = 32;

export default `
  margin-left: ${mobilePageMargin}px;
  margin-right: ${mobilePageMargin}px;
  @media ${breakpoints.tablet} {
    margin-left: ${tabletPageMargin}px;
    margin-right: ${tabletPageMargin}px;
  }
  @media ${breakpoints.desktop} {
    margin-left: auto;
    margin-right: auto;
    width: ${size.desktop - 32 * 2}px;
  }
`;
