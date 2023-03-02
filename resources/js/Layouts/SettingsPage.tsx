import Grid, { GridItem } from "@/Components/foodimus/Grid";
import Separator, { separatorColor } from "@/Components/foodimus/Separator";
import ControlText from "@/Components/foodimus/typography/ControlText";
import { H2 } from "@/Components/foodimus/typography/Headings";
import useRoute from "@/Hooks/useRoute";
import headerContentWidth from "@/Theme/headerContentWidth";
import { Auth } from "@/Types/page-data";
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import BasicPage from "./BasicPage";
import { Inertia } from "@inertiajs/inertia";
import Flash, { FlashProps } from "@/Partials/Flash";
import breakpoints from "@/Theme/breakpoints";
import ErrorBoundary from "@/Components/foodimus/ErrorBoundary";

const Content = styled(Grid).attrs(() => ({
  cols: {
    "default": [1],
    tablet: ["auto", 1],
  },
  areas: {
    "default": [
      {
        name: "menu",
        start: [0, 0],
      },
      {
        name: "content",
        start: [0, 1],
      },
    ],
    tablet: [
      {
        name: "menu",
        start: [0, 0],
      },
      {
        name: "content",
        start: [1, 0],
      },
    ],
  },
}))`
  ${headerContentWidth};
  padding: 50px 0;
  .menu {
    padding: 0 0 36px;
    border-bottom: solid thin ${({ theme }) => theme.colors[separatorColor]};
    @media ${breakpoints.tablet} {
      padding: 0 36px 0;
      border-right: solid thin ${({ theme }) => theme.colors[separatorColor]};
      border-bottom: none;
    }
  }
  .menu-items {
    padding: 20px 0 0;
    width: 220px;
  }
  .menu,
  .menu-items {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .content {
    padding: 36px 0 0 0;
    @media ${breakpoints.tablet} {
      padding: 0 0 0 36px;
    }
  }
`;

export type Data = {
  auth: Auth;
  flash: FlashProps | null;
};

type Props = Data & {
  children?: React.ReactNode;
  modal?: React.ReactNode;
};

export const SettingsPage = ({ auth, flash, modal, children }: Props) => {
  const { t } = useTranslation("settings");
  const { current, route } = useRoute();
  return (
    <BasicPage flash={null} modal={modal} auth={auth}>
      <ErrorBoundary>
        <Content>
          <GridItem className="menu" area="menu" dir="vertical">
            <ErrorBoundary>
              <H2>{t("settings-page.menu.title")}</H2>
              <div className="menu-items">
                <button
                  onClick={() => {
                    Inertia.get(route("user-info"));
                  }}
                >
                  <ControlText
                    size="lg"
                    variant={current() === "user-info" ? "bold" : undefined}
                  >
                    {t("settings-page.menu.user-information")}
                  </ControlText>
                </button>
                <Separator />
                <button
                  onClick={() => {
                    Inertia.get(route("user-password"));
                  }}
                >
                  <ControlText
                    size="lg"
                    variant={current() === "user-password" ? "bold" : undefined}
                  >
                    {t("settings-page.menu.user-password")}
                  </ControlText>
                </button>
                <Separator />
                <button
                  onClick={() => {
                    Inertia.get(route("user-personal"));
                  }}
                >
                  <ControlText
                    size="lg"
                    variant={current() === "user-personal" ? "bold" : undefined}
                  >
                    {t("settings-page.menu.personal-settings")}
                  </ControlText>
                </button>
                <Separator />
                <button
                  onClick={() => {
                    Inertia.get(route("user-personal-goals"));
                  }}
                >
                  <ControlText
                    size="lg"
                    variant={
                      current() === "user-personal-goals" ? "bold" : undefined
                    }
                  >
                    {t("settings-page.menu.personal-goals")}
                  </ControlText>
                </button>
                <Separator />
                <button
                  onClick={() => {
                    Inertia.get(route("user-personal-allergies"));
                  }}
                >
                  <ControlText
                    size="lg"
                    variant={
                      current() === "user-personal-allergies"
                        ? "bold"
                        : undefined
                    }
                  >
                    {t("settings-page.menu.personal-allergies")}
                  </ControlText>
                </button>
                <Separator />
                <button
                  onClick={() => {
                    Inertia.get(route("user-subscription"));
                  }}
                >
                  <ControlText
                    size="lg"
                    variant={
                      current() === "user-subscription" ? "bold" : undefined
                    }
                  >
                    {t("settings-page.menu.subscription")}
                  </ControlText>
                </button>
              </div>
            </ErrorBoundary>
          </GridItem>
          <GridItem className="content" area="content" dir="vertical" gap={12}>
            <ErrorBoundary>{flash && <Flash {...flash} />}</ErrorBoundary>
            <ErrorBoundary>{children}</ErrorBoundary>
          </GridItem>
        </Content>
      </ErrorBoundary>
    </BasicPage>
  );
};

export default SettingsPage;
