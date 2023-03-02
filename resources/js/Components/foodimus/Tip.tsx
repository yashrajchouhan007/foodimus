import { ThemeColor } from "@/Theme";
import React from "react";
import styled from "styled-components";
import Grid, { GridItem } from "./Grid";
import breakpoints from "@/Theme/breakpoints";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { definition as faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";

import headerContentWidth from "@/Theme/headerContentWidth";
import SlideUp from "./SlideUp";
import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";
const StyledContainer = styled(Grid)`
  width: 100%;
`;
const Avatar = styled.div.withConfig(hidePropsFromHtml("color", "flip"))<{
  color: ThemeColor;
  flip: boolean;
}>`
  border-radius: 999px;
  overflow: hidden;
  background-color: ${({ theme, color }) => theme.colors[color]};
  img {
    width: 100%;
  }
  ${({ flip }) => flip && `transform: scale(-1,1);`}

  width: 72px;
  height: 72px;
  @media ${breakpoints.tablet} {
    width: 100px;
    height: 100px;
  }
`;

const SpeechBox = styled.div.withConfig(hidePropsFromHtml("pinTo", "color"))<{
  pinTo: "left" | "right";
  color: ThemeColor;
}>`
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme, color }) => theme.colors[color]};

  padding: 20px;
  border-radius: 10px;
  width: 100%;
  ${({ pinTo }) =>
    pinTo === "left" ? "margin-left: 26px;" : "margin-right: 26px;"}
  min-height: 100%;
  position: relative;
  :before {
    content: "";
    display: block;
    position: absolute;
    ${({ pinTo }) => (pinTo === "left" ? "left: 0;" : "right: 0;")}
    z-index: -1;
    background-color: inherit;
    width: 10px;
    height: 10px;
    transform: translate(
        ${({ pinTo }) => (pinTo === "left" ? "-5px" : "5px")},
        -5px
      )
      scale(1.6, 1) rotate(45deg);
    top: 36px;

    @media ${breakpoints.tablet} {
      top: 50px;
    }
  }
`;
const Content = styled(GridItem)`
  position: relative;
`;
const CloseButton = styled.button.attrs(() => ({
  children: <FontAwesomeIcon icon={faTimes} />,
}))`
  position: absolute;
  top: 10px;
  right: 15px;
  color: ${({ theme }) => theme.colors.whiteA70};
  transition: color 100ms linear;
  @media (hover: hover) {
    :hover {
      color: ${({ theme }) => theme.colors.white};
    }
  }
  :active {
    color: ${({ theme }) => theme.colors.whiteA50};
  }
`;

export const TipContainer = styled(SlideUp).withConfig<any>(
  hideProps("contained")
)<{
  open: boolean;
  contained?: boolean;
}>`
  ${({ contained }) => !contained && `${headerContentWidth};`}
  ${({ open }) =>
    open
      ? `
  margin-top: 30px;
  width: auto;
  @media ${breakpoints.tablet} {
    margin-top: 50px;
  }
  `
      : `margin-top:0;`}
`;

type Props = {
  backgroundColor: ThemeColor;
  avatarColor: ThemeColor;
  ambassadorAvatar?: string;
  avatarSide: "left" | "right";
  children?: React.ReactNode;
  flipAvatar?: boolean;
  closeable?: boolean;
  onClose?: () => void;
};

export const Tip = ({
  backgroundColor,
  avatarColor,
  ambassadorAvatar,
  avatarSide,
  children,
  flipAvatar,
  closeable,
  onClose,
}: Props) => {
  return (
    <StyledContainer
      cols={["auto", 1]}
      areas={
        avatarSide === "left"
          ? [
              { name: "avatar", start: [0, 0] },
              { name: "content", start: [1, 0] },
            ]
          : [
              { name: "content", start: [0, 0] },
              { name: "avatar", start: [1, 0] },
            ]
      }
    >
      <GridItem area="avatar">
        <Avatar flip={flipAvatar || false} color={avatarColor}>
          <img src={ambassadorAvatar} />
        </Avatar>
      </GridItem>
      <Content area="content">
        <SpeechBox pinTo={avatarSide} color={backgroundColor}>
          {children}
          {!!closeable && <CloseButton onClick={onClose}></CloseButton>}
        </SpeechBox>
      </Content>
    </StyledContainer>
  );
};

export default Tip;
