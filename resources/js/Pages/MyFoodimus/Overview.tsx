import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Grid, { GridItem } from "@/Components/foodimus/Grid";

import styled from "styled-components";
import headerContentWidth from "@/Theme/headerContentWidth";
import breakpoints from "@/Theme/breakpoints";
import { H2, Heading } from "@/Components/foodimus/typography/Headings";
import RoundedBox from "@/Components/foodimus/RoundedBox";
import CurrentMealPlan from "@/Partials/overview/CurrentMealPlan";
import PreviousMealPlans from "@/Partials/overview/PreviousMealPlans";
import Directional from "@/Components/foodimus/Directional";
import { Inertia } from "@inertiajs/inertia";
import Button from "@/Components/foodimus/Button";
import MultilineText from "@/Components/foodimus/typography/MultilineText";
import { Auth, MealPlan, TipProps } from "@/Types/page-data";
import useRoute from "@/Hooks/useRoute";
import BasicPage from "@/Layouts/BasicPage";
import Tip from "@/Partials/Tip";
import SwitchMealPlanModal from "@/Partials/SwitchMealPlanModal";
import { FlashProps } from "@/Partials/Flash";
import Separator from "@/Components/foodimus/Separator";
import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";

const StyledSeparator = styled(Separator).withConfig<any>(hideProps("area"))<{
  area: string;
}>`
  grid-area: ${({ area }) => area};
  @media ${breakpoints.tablet} {
    display: none;
  }
`;
const PageContent = styled(Grid).attrs(() => ({
  cols: {
    "default": [1],
    tablet: [1, 1],
    laptop: ["481px", 1],
  },
  areas: {
    "default": [
      { name: "current", start: [0, 0] },
      { name: "separator", start: [0, 1] },
      { name: "previous", start: [0, 2] },
    ],
    tablet: [
      { name: "current", start: [0, 0] },
      { name: "previous", start: [1, 0] },
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
const PreviousMealPlanHeader = styled(Heading).attrs((p) => ({
  as: p.as || "h3",
}))`
  font-size: 33px;
  line-height: 40px;
  @media ${breakpoints.tablet} {
    padding-top: 6px;
  }
  .directional {
    display: none;
    float: right;
    @media ${breakpoints.tablet} {
      display: block;
    }
  }
`;
const CurrentMealPlanPlaceholder = styled(RoundedBox)`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: flex-start;
`;

type CurrentMealPlan = MealPlan & {
  currentDay: number;
};

type OverviewData = {
  auth: Auth;
  tip?: TipProps;
  currentMealPlan?: CurrentMealPlan;
  previousMealPlans?: MealPlan[];
  flash: FlashProps | null;
};
type Props = OverviewData;
export const OverviewPage = (p: Props) => {
  const { t } = useTranslation("overview");
  const { route } = useRoute();
  const [modal, setModal] = useState(null as React.ReactNode | null);
  const previousMealPlanCarousel = useRef<{
    goToNext: () => void;
    goToPrev: () => void;
  }>();
  return (
    <BasicPage modal={modal} auth={p.auth} flash={p.flash}>
      {p.tip && <Tip {...p.tip} />}
      <PageContent>
        <GridItem area="current" dir="vertical" gap={30}>
          {p.currentMealPlan ? (
            <>
              <H2>{t("current-mealplan.title")}</H2>
              <CurrentMealPlan
                heroImage={p.currentMealPlan.heroImg?.src}
                heroImageFocus={p.currentMealPlan.heroImg?.focus}
                caption={p.currentMealPlan.caption}
                title={p.currentMealPlan.title}
                currentDay={p.currentMealPlan.currentDay}
                totalDays={p.currentMealPlan.totalDays}
                onClickToday={() => {
                  Inertia.get(route("today"));
                }}
                onClickMoreInfo={((slug) => () => {
                  Inertia.get(route("meal-plan", { slug }));
                })(p.currentMealPlan.slug)}
                onClickHeader={() => {
                  Inertia.get(route("today"));
                }}
                onClickCaption={((slug) => () => {
                  Inertia.get(route("meal-plan", { slug }));
                })(p.currentMealPlan.slug)}
                onClickTitle={((slug) => () => {
                  Inertia.get(route("meal-plan", { slug }));
                })(p.currentMealPlan.slug)}
              />
            </>
          ) : (
            <CurrentMealPlanPlaceholder>
              <H2>{t("current-meal-plan.placeholder.title")}</H2>
              <MultilineText>
                {t("current-meal-plan.placeholder.content")}
              </MultilineText>
              <Button
                color="green"
                onClick={() => {
                  Inertia.get(route("search", { section: "meal-plan" }));
                }}
              >
                {t("current-meal-plan.placeholder.button-browse")}
              </Button>
            </CurrentMealPlanPlaceholder>
          )}
        </GridItem>
        <StyledSeparator area="separator" color="purpleA20" />
        <GridItem dir="vertical" area="previous" gap={30}>
          {p.previousMealPlans ? (
            <>
              <PreviousMealPlanHeader>
                {t("previous-mealplan.title")}
                <Directional
                  className="directional"
                  onClickLeft={() =>
                    previousMealPlanCarousel.current?.goToPrev()
                  }
                  onClickRight={() =>
                    previousMealPlanCarousel.current?.goToNext()
                  }
                />
              </PreviousMealPlanHeader>
              <PreviousMealPlans
                mealplans={p.previousMealPlans.map((i) => {
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
                  return {
                    id: i.slug,
                    avatarColor: "green",
                    ambassadorAvatar: i.ambassador?.avatar?.src,
                    ambassadorName: i.ambassador?.name,
                    heroImage: i.heroImg?.src,
                    heroImageFocus: i.heroImg?.focus,
                    title: i.title,
                    totalDays: i.totalDays,
                    onClickTitle: navToMealPlan,
                    onClickTab: navToMealPlan,
                    onClickHeader: navToMealPlan,
                    onClickAmbassador: navToAmbassador,
                    onClickActivate: () => {
                      setModal(
                        <SwitchMealPlanModal
                          slug={i.slug}
                          onClose={() => setModal(null)}
                          hasPlan={!!p.currentMealPlan}
                        />
                      );
                    },
                  };
                })}
                carouselRef={previousMealPlanCarousel}
              />
            </>
          ) : (
            <></>
          )}
        </GridItem>
      </PageContent>
    </BasicPage>
  );
};

export default OverviewPage;
