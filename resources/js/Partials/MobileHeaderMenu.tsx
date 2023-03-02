import { Avatar } from "@/Partials/HeaderMenu";
import SlideUp from "@/Components/foodimus/SlideUp";
import React from "react";
import styled from "styled-components";
import Logo from "-!react-svg-loader!@img/logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { definition as faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";

import { mobilePageMargin } from "@/Theme/headerContentWidth";
import Separator from "@/Components/foodimus/Separator";
import { definition as faFacebookF } from "@fortawesome/free-brands-svg-icons/faFacebookF";
import { definition as faInstagram } from "@fortawesome/free-brands-svg-icons/faInstagram";

import useRoute from "@/Hooks/useRoute";
import { Inertia } from "@inertiajs/inertia";
import { useTranslation } from "react-i18next";

const StyledMenuContainer = styled(SlideUp)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.purple};
  z-index: 899;
  .inner {
    padding: ${mobilePageMargin}px;
    display: flex;
    flex-direction: column;
    color: ${({ theme }) => theme.colors.white};
    .header {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      .logo {
        color: inherit;
      }
      .button,
      .avatar {
        flex: 1;
        display: flex;
      }
      .avatar {
        flex-direction: row-reverse;
      }
    }
    .separator {
      margin: ${mobilePageMargin}px 0;
    }
    .main-item {
      height: 73px;
      font-size: 33px;
      font-family: ${({ theme }) => theme.fonts.controlBold};
    }
    .sub-item {
      height: 43px;
      font-size: 21px;
      font-family: ${({ theme }) => theme.fonts.control};
    }
    .footer {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 10px;
      .fill {
        flex: 1;
      }
      button.social {
        color: ${({ theme }) => theme.colors.purple};
        background-color: ${({ theme }) => theme.colors.white};
        text-align: center;
        width: 27px;
        height: 27px;
        border-radius: 999px;
      }
    }
  }
`;

type Props = {
  open: boolean;
  avatar?: string | React.ReactNode;
  onClose: () => void;
};
export const MobileHeaderMenu = ({ open, avatar, onClose }: Props) => {
  const { t } = useTranslation("header-menu");
  const { route } = useRoute();
  const navtoUrl = (url: string, blank?: boolean) => () =>
    window.open(url, blank ? "_blank" : undefined);
  const navToRoute = (key: string) => () => Inertia.get(route(key));
  return (
    <StyledMenuContainer open={open}>
      <div className="header">
        <div className="button">
          <button onClick={onClose}>
            <FontAwesomeIcon size="2x" icon={faTimes} />
          </button>
        </div>
        <Logo className="logo" />
        <div className="avatar">
          {avatar && (
            <Avatar>
              {typeof avatar === "string" ? <img src={avatar} /> : avatar}
            </Avatar>
          )}
        </div>
      </div>
      <Separator color="whiteA20" />
      <button className="main-item" onClick={navToRoute("overview")}>
        {t("mobile-menu.button-my-foodimus")}
      </button>
      <button className="sub-item" onClick={navToRoute("today")}>
        {t("mobile-menu.button-my-foodimus.today")}
      </button>
      <button className="sub-item" onClick={navToRoute("shopping-list")}>
        {t("mobile-menu.button-my-foodimus.shopping-list")}
      </button>
      <button className="sub-item" onClick={navToRoute("user-subscription")}>
        {t("mobile-menu.button-my-foodimus.subscription")}
      </button>
      <Separator color="whiteA20" />
      <div className="footer">
        <div className="fill" />
        <button
          onClick={navtoUrl("https://www.instagram.com/foodimus/", true)}
          className="social"
        >
          <FontAwesomeIcon icon={faInstagram} />
        </button>
        <button
          onClick={navtoUrl("https://www.facebook.com/foodimus/", true)}
          className="social"
        >
          <FontAwesomeIcon icon={faFacebookF} />
        </button>
      </div>
    </StyledMenuContainer>
  );
};

export default MobileHeaderMenu;
