import { GridItem } from "@/Components/foodimus/Grid";
import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";
import breakpoints from "@/Theme/breakpoints";
import styled from "styled-components";

export const PictureContainer = styled(GridItem)`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 9px;
  color: ${({ theme }) => theme.colors.backgroundD10};
  //@media ${breakpoints.tablet} {
  //  flex-direction: column;
  //  flex-wrap: nowrap;
  //  justify-content: flex-start;
  //  align-items: flex-end;
  //  gap: 16px;
  //}
`;
export const Picture = styled.div.withConfig(
  hidePropsFromHtml("src", "focus")
)<{
  src: string;
  focus: [number, number];
}>`
  background: url("${({ src }) => src}");
  background-position: ${({ focus: [x, y] }) => `${x * 100}% ${y * 100}%`};
  background-size: cover;
  border-radius: 10px;
  width: 106px;
  height: 110px;
  @media ${breakpoints.tablet} {
    width: 182px;
    height: 189px;
  }
  @media ${breakpoints.laptop} {
    width: 120px;
    height: 135px;
  }
  @media ${breakpoints.desktop} {
    width: 182px;
    height: 189px;
  }
`;
