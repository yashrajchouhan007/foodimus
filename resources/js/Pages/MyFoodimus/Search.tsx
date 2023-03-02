import React from "react";
import { useTranslation } from "react-i18next";
import Grid from "@/Components/foodimus/Grid";
import styled from "styled-components";
import headerContentWidth from "@/Theme/headerContentWidth";
import breakpoints from "@/Theme/breakpoints";
import { Avatar, Image, Auth, Ambassador } from "@/Types/page-data";
import useRoute from "@/Hooks/useRoute";
import { H3 } from "@/Components/foodimus/typography/Headings";
import PictureHeaderPage from "@/Layouts/PictureHeaderPage";
import { Inertia } from "@inertiajs/inertia";
import MealPlanItem from "@/Partials/search/MealPlan";
import AmbassadorItem from "@/Partials/search/Ambassador";
import { FlashProps } from "@/Partials/Flash";

const PageContent = styled(Grid).attrs(() => ({
  cols: {
    "default": [1],
  },
}))`
  ${headerContentWidth};
  padding: 30px 0;
  gap: 50px;
  @media ${breakpoints.tablet} {
    padding: 50px 0;
  }
`;

const Tabs = styled.div`
  position: relative;
  .tabs {
    display: flex;
    gap: 10px;
    .tab {
      position: relative;
      border-radius: 10px 10px 0 0;
      padding: 10px 20px 20px;
      background-color: ${({ theme }) => theme.colors.white};
      color: ${({ theme }) => theme.colors.purple};
      box-shadow: 1px 2px 6px #00000033;
      z-index: 1;
      &.active {
        background-color: ${({ theme }) => theme.colors.purple};
        color: ${({ theme }) => theme.colors.white};
        font-weight: 500;
        box-shadow: none;
        z-index: 2;
      }
    }
  }
  .tab-content {
    position: relative;
    background-color: ${({ theme }) => theme.colors.purple};
    color: ${({ theme }) => theme.colors.white};
    border-radius: 10px;
    min-height: 6px;
    margin-top: -3px;
    z-index: 3;
  }
`;
// TODO: when adding content to tab-content, replace css with this:
//min-height: 20px;
//margin-top: -10px;
//z-index: 3;
type MealPlanProps = {
  name: string;
  slug: string;
  totalDays: number;
  heroImg?: Image;
  ambassador?: Ambassador;
};

type AmbassadorProps = {
  name: string;
  title: string;
  slug: string;
  heroImg: Image | null;
  avatar: Avatar | null;
};

type Props = {
  auth: Auth;
  flash: FlashProps | null;
  heroImg?: Image;
  modal?: React.ReactNode;
  children?: React.ReactNode;
  mealPlan?: MealPlanProps[];
  ambassador?: AmbassadorProps[];
};

type Params = {
  section: "meal-plan" | "ambassador";
};
export default ({ children, mealPlan, ambassador, ...p }: Props) => {
  const { t } = useTranslation("search");
  const { params: _params, route } = useRoute();
  const { section } = _params as Params;
  return (
    <PictureHeaderPage
      title={t(`title.${section}`)}
      subtitle={t(`subtitle.${section}`)}
      {...p}
    >
      <PageContent>
        <Tabs>
          <div className="tabs">
            <button
              className={"tab" + (section === "ambassador" ? " active" : "")}
              onClick={() => {
                Inertia.get(
                  route("search", { section: "ambassador" }),
                  undefined,
                  { preserveScroll: true }
                );
              }}
            >
              {t("tab-ambassador")}
            </button>
            <button
              className={"tab" + (section === "meal-plan" ? " active" : "")}
              onClick={() => {
                Inertia.get(
                  route("search", { section: "meal-plan" }),
                  undefined,
                  { preserveScroll: true }
                );
              }}
            >
              {t("tab-meal-plan")}
            </button>
          </div>
          <div className="tab-content"></div>
        </Tabs>
        {section === "ambassador" && ambassador && (
          <>
            <H3>
              {t(
                `ambassador.title.${
                  ambassador.length > 2 ? 2 : ambassador.length
                }`,
                { count: ambassador.length }
              )}
            </H3>
            <Grid
              gap={40}
              cols={{
                "default": [1],
                tablet: [1, 1, 1],
                laptop: [1, 1, 1, 1],
              }}
            >
              {ambassador.map((i, ix) => {
                const navToAmbassador = () => {
                  Inertia.get(route("ambassador", { slug: i.slug }));
                };
                return (
                  <AmbassadorItem
                    key={ix}
                    heroImage={i.heroImg?.src}
                    heroImageFocus={i.heroImg?.focus}
                    avatarColor="yellow"
                    ambassadorAvatar={i.avatar?.src}
                    ambassadorName={i.name}
                    flipAvatar={i.avatar?.orientation === "right"}
                    title={i.title}
                    onClickTitle={navToAmbassador}
                    onClickMoreInfo={navToAmbassador}
                    onClickAvatar={navToAmbassador}
                    onClickHeader={navToAmbassador}
                  />
                );
              })}
            </Grid>
          </>
        )}
        {section === "meal-plan" && mealPlan && (
          <>
            <H3>
              {t(
                `meal-plan.title.${mealPlan.length > 2 ? 2 : mealPlan.length}`,
                { count: mealPlan.length }
              )}
            </H3>
            <Grid
              gap={40}
              cols={{
                "default": [1],
                tablet: [1, 1, 1],
                desktop: [1, 1, 1, 1],
              }}
            >
              {mealPlan.map((i, ix) => {
                const navToMealPlan = () => {
                  Inertia.get(route("meal-plan", { slug: i.slug }));
                };
                const ambassadorSlug = i.ambassador?.slug;
                const navToAmbassador =
                  ambassadorSlug === undefined
                    ? undefined
                    : () => {
                        Inertia.get(
                          route("ambassador", { slug: ambassadorSlug })
                        );
                      };
                return (
                  <MealPlanItem
                    key={ix}
                    heroImage={i.heroImg?.src}
                    heroImageFocus={i.heroImg?.focus}
                    title={i.name}
                    totalDays={i.totalDays}
                    avatarColor="yellow"
                    ambassadorAvatar={i.ambassador?.avatar?.src}
                    ambassadorName={i.ambassador?.name}
                    flipAvatar={i.ambassador?.avatar?.orientation === "right"}
                    onClickTitle={navToMealPlan}
                    onClickHeader={navToMealPlan}
                    onClickTab={navToMealPlan}
                    onClickMoreInfo={navToMealPlan}
                    onClickAmbassador={navToAmbassador}
                  />
                );
              })}
            </Grid>
          </>
        )}
      </PageContent>
    </PictureHeaderPage>
  );
};
