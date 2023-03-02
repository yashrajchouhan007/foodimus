/**
 * A Foodimus logo, overlayed with a picture
 */
import React from "react";
import styled, { withTheme } from "styled-components";
import LogoDetail from "-!react-svg-loader!@img/logo-detail.svg";
import breakpoints from "@/Theme/breakpoints";
import { Theme, ThemeColor } from "@/Theme";
import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";

const StyledContainer = styled.div.withConfig(hidePropsFromHtml("size"))<{
  size: "sm" | "lg";
}>`
  ${({ size }) =>
    size === "lg" &&
    `
position: relative;
top: -10px;
margin-right: -80px;
width: 180px;
height: 100%;
user-select: none;
pointer-events: none;

* {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.logo {
  top: 5%;
}
.img {
  left: 10%;
  width: 70%;
}
@media ${breakpoints.tablet} {
  top: -25px;
  right: 10px;
  width: 350px;
  .logo {
    top: 0;
  }
  .img {
    left: 30%;
    width: 80%;
  }
}
`}
  ${({ size }) =>
    size === "sm" &&
    `
  position: relative;
  top: -5px;
  margin-right: -50px;
  width: 150px;
  height: 100%;
  user-select: none;
  pointer-events: none;

  * {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  .logo {
    top: 10%;
  }
  .img {
    left: 10%;
    width: 70%;
  }
  @media ${breakpoints.tablet} {
    top: 30px;
    right: 30px;
    width: 300px;
    .logo {
      top: 10%;
    }
    .img {
      left: 10%;
      width: 70%;
    }
  }
  `}
`;
type Props = {
  theme: Theme;
  imageSrc?: string;
  themeColor: ThemeColor;
  size: "sm" | "lg";
};
export default withTheme(({ theme, imageSrc, themeColor, size }: Props) => {
  return (
    <StyledContainer size={size}>
      <LogoDetail className="logo" fill={theme.colors[themeColor]} />
      {imageSrc && <img className="img" src={imageSrc} />}
    </StyledContainer>
  );
});
