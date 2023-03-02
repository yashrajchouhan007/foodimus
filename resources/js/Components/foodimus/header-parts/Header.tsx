/**
 * This component renders a basic header with an optional background image,
 * the correct header menu, based on whether there's a logged in user,
 * an optional menu component and optional content to overlay on top of the
 * background component
 */

import React, { ReactNode } from "react";
import styled from "styled-components";
import HeaderMenu from "../../../Partials/HeaderMenu";
import responsive, {
  Responsive,
  ResponsiveKey,
  responsiveValue,
} from "@/Helpers/responsive";
import size, { Size } from "@/Helpers/size";
import Background from "./HeaderBackground";
import { ThemeColor } from "@/Theme";
import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";
import { UserHeaderMenuLink } from "@/Partials/UserHeaderMenu";
import { Auth } from "@/Types/page-data";
import FallbackAvatar from "@img/fallback-avatar.png";
import { useTranslation } from "react-i18next";

const Container = styled.div.withConfig(hidePropsFromHtml("height"))<{
  height?: Responsive<Size>;
}>`
  ${(props) =>
    props.height ? responsive(props.height, (s) => size("height", s)) : ""}
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

type Props = {
  variant?: "small" | "medium" | "large";
  background?: string;
  backgroundColor?: ThemeColor;
  backgroundFocus?: [number, number];
  menu?: ReactNode;
  overlay?: ReactNode;
  guest?: boolean;
  backgroundHeight?: Responsive<Size>;
  auth?: Auth;
} & React.ComponentProps<typeof Container>;

export const Header = ({
  background,
  backgroundColor,
  backgroundFocus,
  variant,
  menu,
  children,
  guest,
  overlay: overlayElement,
  backgroundHeight,
  auth,
  ...p
}: Props) => {
  const { t } = useTranslation("header-menu");
  let overlay = 0;
  if (background && background.match(/^(\.|\/|https?:\/\/)/)) {
    background = `url('${background}')`;
    overlay = 0.5;
  }
  const userFirstName = auth?.user?.firstname || "User";
  const avatarSrc =
    typeof auth?.user?.avatar === "object"
      ? auth?.user?.avatar?.src
      : auth?.user?.avatar || FallbackAvatar;
  const links: UserHeaderMenuLink[] = [];
  if (auth?.user?.cms_url)
    links.push({
      label: t("user-menu.button-manage"),
      url: auth?.user?.cms_url,
    });
  const myHeaderMenu = (
    <HeaderMenu
      guest={!!guest}
      onDark={variant === "medium" || variant === "large"}
      avatar={avatarSrc}
      userFirstName={userFirstName || ""}
      links={links}
    ></HeaderMenu>
  );
  if (variant === "medium" || variant === "large") {
    const height = {
      medium: {
        "default": 260,
        tablet: 380,
      },
      large: {
        "default": 380,
        tablet: 520,
      },
    }[variant];
    const getCornerY = (breakpoint: ResponsiveKey, fromBottom: number) => {
      const h = responsiveValue(height, breakpoint);
      return (h - fromBottom) / h;
    };
    const cornerY = {
      "default": getCornerY("default", 25),
      tablet: getCornerY("tablet", 50),
      laptop: getCornerY("laptop", 75),
      desktop: getCornerY("desktop", 100),
    };

    return (
      <Container height={height} {...p}>
        {overlayElement && overlayElement}
        {myHeaderMenu}
        {menu}
        <Background
          overlay={overlay}
          background={background}
          backgroundColor={backgroundColor}
          focus={backgroundFocus}
          cornerY={cornerY}
          log={true}
          height={backgroundHeight}
        >
          {children}
        </Background>
      </Container>
    );
  }
  return <Container {...p}>{myHeaderMenu}</Container>;
};

export default Header;
