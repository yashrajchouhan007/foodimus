import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { MealHeader } from "@/Partials/Headers";
import FallbackAvatar from "@img/fallback-avatar.png";
import Foodimus from "@/Layouts/FoodimusPage";
import { Image, Auth, Ambassador, TipProps } from "@/Types/page-data";
import useRoute from "@/Hooks/useRoute";
import { MealIconDef, MealIconName } from "@/Components/foodimus/MealIcon";
import Submenu from "@/Components/foodimus/Submenu";
import { ThemeColor } from "@/Theme";
import { Inertia } from "@inertiajs/inertia";
import ErrorBoundary from "@/Components/foodimus/ErrorBoundary";
import { FlashProps } from "@/Partials/Flash";
import Grid, { GridItem } from "@/Components/foodimus/Grid";
import { PictureContainer, Picture } from "@/Partials/meal/Pictures";
import Meals, { MealsProps } from "@/Partials/meals/Meals";
import Tip from "@/Partials/Tip";
import RoundedBox from "@/Components/foodimus/RoundedBox";
import styled from "styled-components";
import { useLaptop } from "@/Hooks/useMedia";
import breakpoints from "@/Theme/breakpoints";
import headerContentWidth from "@/Theme/headerContentWidth";

const PageContent = styled(Grid).attrs(() => ({
  cols: {
    "default": [1],
    laptop: [1, "392px"],
    desktop: [1, "578px"],
  },
  rows: {
    "default": ["auto", "auto", "auto", 1],
    laptop: ["auto", "auto", 1],
  },
  areas: {
    "default": [
      { name: "pictures", start: [0, 0] },
      { name: "content", start: [0, 1] },
      { name: "meals", start: [0, 2] },
      { name: "tip", start: [0, 3] },
    ],
    laptop: [
      { name: "content", start: [0, 0], end: [0, 2] },
      { name: "pictures", start: [1, 0] },
      { name: "meals", start: [1, 1] },
      { name: "tip", start: [1, 2] },
    ],
  },
}))`
  ${headerContentWidth};
  padding: 30px 0;
  gap: 50px;
  @media ${breakpoints.tablet} {
    padding: 50px 0;
  }
`;

const MealsBox = styled(RoundedBox)`
  padding: 30px;
`;

export type MealData = {
  ambassador: Ambassador;
  heroImg?: Image;
  icon: MealIconName;
  iconColor: ThemeColor;
  mealType: string;
  name: string;
  recipeServings: number;
  servings: number;
};

type LayoutData = {
  auth: Auth;
  meal?: MealData;
};
type Props = LayoutData &
  Partial<MealsProps> & {
    modal?: React.ReactNode;
    children?: React.ReactNode;
    flash: FlashProps | null;
    hasStory?: boolean;
    mealPictures?: Image[];
    tip?: TipProps;
  };

type Params = {
  date: string;
  slug: string;
};
export const MealPage = ({
  meal,
  modal,
  children,
  flash,
  hasStory,
  tip,
  mealPictures,
  currentDay,
  currentMealPlan,
  ...p
}: Props) => {
  const { t } = useTranslation("meal");
  const verticalLayout = !useLaptop();
  const { route, current, params: _params } = useRoute();
  const params = _params as Params;
  const { slug, date } = params as { slug: string; date: string };
  return (
    <Foodimus
      header={
        <MealHeader
          auth={p.auth}
          ambassadorImg={meal?.ambassador.overlayImg?.src}
          backgroundImg={meal?.heroImg?.src}
          backgroundFocus={meal?.heroImg?.focus}
          iconColor={meal?.iconColor || "red"}
          icon={<MealIconDef icon={meal?.icon || "none"} />}
          title={meal?.name}
          subtitle={
            <ErrorBoundary>
              <span>
                <Trans
                  ns="meal"
                  i18nKey="header.subtitle"
                  values={{
                    mealType: t(`common:meal-type.${meal?.mealType}`),
                    ambassadorName: meal?.ambassador.shortName,
                  }}
                  components={{
                    b: <strong />,
                  }}
                ></Trans>
              </span>
            </ErrorBoundary>
          }
        >
          <ErrorBoundary>
            <Submenu>
              {hasStory !== false && (
                <button
                  onClick={() => {
                    Inertia.get(route("meal", { slug, date }), undefined, {
                      preserveScroll: true,
                    });
                  }}
                  className={current("meal") ? "active" : ""}
                >
                  {t("header-menu.information")}
                </button>
              )}
              <button
                onClick={() => {
                  Inertia.get(route("ingredients", { slug, date }), undefined, {
                    preserveScroll: true,
                  });
                }}
                className={current("ingredients") ? "active" : ""}
              >
                {t("header-menu.ingredients")}
              </button>
              <button
                onClick={() => {
                  Inertia.get(route("recipe", { slug, date }), undefined, {
                    preserveScroll: true,
                  });
                }}
                className={current("recipe") ? "active" : ""}
              >
                {t("header-menu.recipe")}
              </button>
              <button
                onClick={() => {
                  Inertia.get(route("nutrition", { slug, date }), undefined, {
                    preserveScroll: true,
                  });
                }}
                className={current("nutrition") ? "active" : ""}
              >
                {t("header-menu.nutrition")}
              </button>
            </Submenu>
          </ErrorBoundary>
        </MealHeader>
      }
      flash={flash}
      modal={modal}
    >
      <PageContent>
        <GridItem area="content" dir="vertical">
          {children}
        </GridItem>
        <GridItem area="meals" dir="vertical">
          {currentDay && currentMealPlan && (
            <MealsBox>
              <Meals
                currentDate={params.date}
                showNutrients={false}
                showDateControls={false}
                currentDay={currentDay}
                currentMealPlan={currentMealPlan}
              />
            </MealsBox>
          )}
        </GridItem>

        <PictureContainer area="pictures">
          {mealPictures?.map(({ src, focus }, ix) => (
            <Picture src={src} focus={focus || [0.5, 0.5]} key={ix} />
          ))}
        </PictureContainer>
        {tip && (
          <GridItem area="tip">
            <Tip
              {...tip}
              contained
              avatarSide={verticalLayout ? "left" : "right"}
              orientation="vertical"
            />
          </GridItem>
        )}
      </PageContent>
    </Foodimus>
  );
};

export default MealPage;
