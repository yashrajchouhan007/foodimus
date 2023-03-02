import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import useRoute from "@/Hooks/useRoute";
import { Inertia } from "@inertiajs/inertia";
import PopupMenu, { PopupMenuItem } from "../Components/foodimus/PopupMenu";
import BodyText from "../Components/foodimus/typography/BodyText";
import styled from "styled-components";

const StyledMenu = styled(PopupMenu)`
  position: absolute;
  right: 0;
  bottom: 0;

  .inner {
    position: absolute;
    right: 0;
  }
`;

export type UserHeaderMenuLink = {
  label: string;
  url?: string;
  route?: { name: string; params: any };
};
type Props = {
  open: boolean;
  links?: UserHeaderMenuLink[];
};
export const UserHeaderMenu = ({ open, links }: Props) => {
  const { route } = useRoute();
  const { t } = useTranslation("header-menu");
  return (
    <StyledMenu className="popup" show={open}>
      <PopupMenuItem
        onClick={() => {
          Inertia.get(route("user"));
        }}
        separators={true}
      >
        <BodyText size="lg">{t("user-menu.button-settings")}</BodyText>
      </PopupMenuItem>
      <PopupMenuItem
        onClick={() => {
          Inertia.post(route("logout"));
        }}
        separators={true}
      >
        <BodyText size="lg">{t("user-menu.button-logout")}</BodyText>
      </PopupMenuItem>
      {links?.map(({ label, url, route: linkRoute }, ix) => (
        <PopupMenuItem
          key={ix}
          onClick={
            url
              ? () => {
                  window.location.assign(url);
                }
              : linkRoute
              ? () => {
                  Inertia.post(route(linkRoute.name, linkRoute.params));
                }
              : undefined
          }
          separators={true}
        >
          <BodyText size="lg">{label}</BodyText>
        </PopupMenuItem>
      ))}
    </StyledMenu>
  );
};

export default UserHeaderMenu;
