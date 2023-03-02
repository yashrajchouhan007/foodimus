/**
 * This module contains heading component styling
 */

import { ThemeColor } from "@/Theme";
import breakpoints from "@/Theme/breakpoints";
import React from "react";
import styled from "styled-components";

type HeadingProps = JSX.IntrinsicElements["div"] & {
  as: "div" | "h1" | "h2" | "h3" | "h4";
  color?: ThemeColor;
};

const BaseHeading = ({ as, color: _color, ...p }: HeadingProps) => {
  switch (as) {
    case "div":
      return <div {...p} />;
    case "h1":
      return <h1 {...p} />;
    case "h2":
      return <h2 {...p} />;
    case "h3":
      return <h3 {...p} />;
    case "h4":
      return <h4 {...p} />;
  }
};

export const Heading = styled(BaseHeading)<HeadingProps>`
  ${({ onClick }) => !!onClick && `cursor: pointer;`}
  ${({ theme, color }) => color && `color: ${theme.colors[color]};`}
  font-family: ${({ theme }) => theme.fonts.controlBold};
`;

export const H1 = styled(Heading).attrs((p) => ({
  as: p.as || "h1",
}))`
  font-size: 37px;
  line-height: 50px;
  @media ${breakpoints.tablet} {
    font-size: 45px;
  }
`;

export const H2 = styled(Heading).attrs((p) => ({
  as: p.as || "h2",
}))`
  font-size: 33px;
  line-height: 40px;
  @media ${breakpoints.tablet} {
    font-size: 37px;
    line-height: 50px;
  }
`;

export const H3 = styled(Heading).attrs((p) => ({
  as: p.as || "h3",
}))`
  font-size: 21px;
  line-height: 28px;
`;

export const H4 = styled(Heading).attrs((p) => ({
  as: p.as || "h4",
}))`
  font-size: 16px;
  line-height: 28px;
  @media ${breakpoints.tablet} {
    font-size: 17px;
  }
`;
