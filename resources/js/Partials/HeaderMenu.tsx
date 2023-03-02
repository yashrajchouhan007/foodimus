import React, { useState } from "react";
import styled from "styled-components";
import Logo from "-!react-svg-loader!@img/logo.svg";
import MenuIcon from "-!react-svg-loader!@img/menu.svg";
import Grid, { GridItem } from "../Components/foodimus/Grid";
import breakpoints from "@/Theme/breakpoints";
import { useTranslation } from "react-i18next";
import headerContentWidth from "@/Theme/headerContentWidth";
import useRoute from "@/Hooks/useRoute";
import { Inertia } from "@inertiajs/inertia";
import MobileHeaderMenu from "@/Partials/MobileHeaderMenu";
import useAutoClose from "@/Hooks/useAutoClose";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { definition as faCaretDown } from "@fortawesome/free-solid-svg-icons/faCaretDown";

import UserHeaderMenu, { UserHeaderMenuLink } from "./UserHeaderMenu";
import FallbackAvatar from "@img/fallback-avatar.png";

export const Avatar = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 999px;
  border: solid 2px ${(props) => props.theme.colors.white};
  background-color: white;
  overflow: hidden;
  img {
    width: 100%;
  }
`;
const BaseHeaderMenu = styled(Grid)`
  ${headerContentWidth}
  margin-top: 18px;
  font-size: 14px;
  line-height: 14px;
  z-index: 200;

  @media ${breakpoints.tablet} {
    margin-top: 22px;
    padding-bottom: 12px;
    border-bottom-width: thin;
    border-bottom-style: solid;
  }

  align-items: center;
  .logo {
    margin-top: 10px;
    margin-bottom: 10px;
    @media ${breakpoints.tablet} {
      margin-top: 5px;
      margin-bottom: 15px;
    }
  }
  .nav {
    flex: 1;
    background-color: ${(props) => props.theme.colors.white};
    display: flex;
    justify-content: space-between;
    border-radius: 10px;
    align-items: center;
    padding: 1px 17px 0;
    margin-top: 14px;
    height: 48px;
    font-family: ${(props) => props.theme.fonts.control};
    box-shadow: 0px 3px 6px #0000000b;
    @media ${breakpoints.tablet} {
      padding: 0;
      margin: 2px 10vw 0 5vw;
      box-shadow: initial;
      height: auto;
      background-color: transparent;
      justify-content: space-around;
    }
  }
  .nav .active {
    font-family: ${(props) => props.theme.fonts.controlBold};
    color: ${(props) => props.theme.colors.purple};
  }
  .menu {
    @media ${breakpoints.tablet} {
      display: none;
    }
  }
  .user {
    position: relative;

    .user-button {
      margin-left: auto;
      margin-right: 0;
      font-family: ${(props) => props.theme.fonts.controlBold};
      display: flex;
      align-items: center;
      gap: 0.5em;
      .welcome {
        display: none;
        @media ${breakpoints.tablet} {
          display: block;
        }
      }
      .arrow {
        display: none;
        transition: transform 200ms ease-in-out;
        @media ${breakpoints.tablet} {
          display: initial;
        }
      }
    }
    &.menu-shown {
      .user-button .arrow {
        transform: rotate(180deg);
      }
    }
  }
`;
const HeaderMenuOnDark = styled(BaseHeaderMenu)`
  border-bottom-color: ${(props) => props.theme.colors.whiteA20};
  .logo,
  .menu,
  .user-button {
    color: ${(props) => props.theme.colors.white};
  }
  @media ${breakpoints.tablet} {
    .nav {
      color: ${(props) => props.theme.colors.white};
    }
    .nav .active {
      color: unset;
    }
  }
`;
const HeaderMenuOnLight = styled(BaseHeaderMenu)`
  border-bottom-color: ${(props) => props.theme.colors.purpleA20};
  .logo,
  .menu {
    color: ${(props) => props.theme.colors.purple};
  }
  .nav {
    color: ${(props) => props.theme.colors.dark};
  }
  .user-button .arrow {
    color: ${(props) => props.theme.colors.red};
  }
`;

type HeaderMenuProps = {
  onDark?: boolean;
} & React.ComponentProps<typeof BaseHeaderMenu>;

const HeaderMenuType = ({ onDark, ...p }: HeaderMenuProps) => {
  if (onDark) return <HeaderMenuOnDark {...p} />;
  return <HeaderMenuOnLight {...p} />;
};

type Props = HeaderMenuProps & {
  avatar?: string | React.ReactNode;
  userFirstName: string;
  guest?: boolean;
  links?: UserHeaderMenuLink[];
};
export const HeaderMenu = ({
  avatar: _avatar,
  userFirstName,
  guest,
  links,
  ...p
}: Props) => {
  const { t } = useTranslation("header-menu");
  const { route, current } = useRoute();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useAutoClose();
  const avatar = _avatar || FallbackAvatar;
  return (
    <HeaderMenuType
      {...p}
      cols={{
        "default": [1, "auto", 1],
        tablet: ["auto", 1, "auto"],
      }}
      areas={{
        "default": [
          { name: "menu", start: [0, 0], end: [0, 0] },
          { name: "logo", start: [1, 0], end: [1, 0] },
          { name: "user", start: [2, 0], end: [2, 0] },
          { name: "nav", start: [0, 1], end: [2, 1] },
        ],
        tablet: [
          { name: "logo", start: [0, 0], end: [0, 0] },
          { name: "nav", start: [1, 0], end: [1, 0] },
          { name: "user", start: [3, 0], end: [3, 0] },
        ],
      }}
    >
      <GridItem className="menu" area="menu">
        <MobileHeaderMenu
          onClose={() => setMenuOpen(false)}
          open={menuOpen}
          avatar={avatar}
        />
        <button onClick={() => setMenuOpen(true)}>
          <MenuIcon />
        </button>
      </GridItem>
      <GridItem area="logo">
        <button onClick={() => Inertia.get(route("overview"))}>
          <Logo className="logo" />
        </button>
      </GridItem>
      {!guest && (
        <>
          <GridItem
            area="user"
            className={"user" + (userMenuOpen ? " menu-shown" : "")}
          >
            <UserHeaderMenu open={userMenuOpen} links={links} />
            <button
              className="user-button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <span className="welcome">
                {t("welcome", {
                  name: userFirstName,
                })}
              </span>
              <Avatar className="avatar">
                {typeof avatar === "string" ? <img src={avatar} /> : avatar}
              </Avatar>
              <FontAwesomeIcon className="arrow" size="lg" icon={faCaretDown} />
            </button>
          </GridItem>
          <GridItem area="nav">
            <div className="nav">
              <button
                onClick={() => {
                  Inertia.get(route("overview"));
                }}
                className={current() === "overview" ? "active" : ""}
              >
                {t("mealplan")}
              </button>
              <button
                onClick={() => {
                  Inertia.get(route("today"));
                }}
                className={current() === "meals" ? "active" : ""}
              >
                {t("today")}
              </button>
              <button
                onClick={() => {
                  Inertia.get(route("shopping-list"));
                }}
                className={current() === "shopping-list" ? "active" : ""}
              >
                {t("shopping-list")}
              </button>
              <button
                onClick={() => {
                  Inertia.get(route("search"));
                }}
                className={current() === "search" ? "active" : ""}
              >
                {t("search")}
              </button>
            </div>
          </GridItem>
        </>
      )}
    </HeaderMenuType>
  );
};

export default HeaderMenu;
