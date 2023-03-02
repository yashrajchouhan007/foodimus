import React, { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import Grid, { GridItem } from "@/Components/foodimus/Grid";
import styled from "styled-components";
import headerContentWidth from "@/Theme/headerContentWidth";
import breakpoints from "@/Theme/breakpoints";
import { Image, Auth, Ambassador } from "@/Types/page-data";
import useRoute from "@/Hooks/useRoute";
import { H3 } from "@/Components/foodimus/typography/Headings";
import Layout from "@/Layouts/MealPlanPage";
import SwitchMealPlanModal from "@/Partials/SwitchMealPlanModal";
import Markdown from "@/Components/foodimus/Markdown";
import Nutrition, { NutritionData } from "@/Partials/meal-plan/Nutrition";
import Days, { DaysData } from "@/Partials/meal-plan/Days";
import { DateTime } from "luxon";
import Button from "@/Components/foodimus/Button";
import { FlashProps } from "@/Partials/Flash";
import { Inertia } from "@inertiajs/inertia";

const PageContent = styled(Grid).attrs(() => ({
  cols: {
    "default": [1],
    tablet: ["auto", 1],
  },
  rows: {
    "default": ["auto"],
    tablet: ["auto", 1],
  },
  areas: {
    "default": [
      { name: "story", start: [0, 0] },
      { name: "nutrition", start: [0, 1] },
      { name: "content", start: [0, 2] },
    ],
    tablet: [
      { name: "story", start: [1, 0] },
      { name: "nutrition", start: [0, 0], end: [0, 1] },
      { name: "content", start: [1, 1] },
    ],
  },
}))`
  ${headerContentWidth};
  padding: 30px 0;
  gap: 50px;
  @media ${breakpoints.tablet} {
    padding: 50px 0;
  }
  .story {
    font-size: 16px;
  }
  .content .text {
    font-size: 16px;
    margin-bottom: 1em;
  }
`;

type Props = Partial<DaysData> &
  Partial<NutritionData> & {
    auth: Auth;
    flash: FlashProps | null;
    header?: {
      heroImg?: Image;
      title: string;
      ambassador?: Ambassador;
    };
    story?: string;
    isCurrent?: boolean;
    activeSince?: string | null;
    userHasMealPlan?: boolean;
  };
type Params = {
  slug: string;
};
export const MealPlanPage = ({
  header,
  days,
  story,
  nutrition,
  isCurrent,
  activeSince,
  userHasMealPlan,
  ...p
}: Props) => {
  const { t } = useTranslation("meal-plan");
  const { route } = useRoute();
  const [modal, setModal] = useState(null as React.ReactNode | null);
  const startedToday =
    activeSince && DateTime.fromISO(activeSince).diffNow("days").days > -1;
  const { params: _params } = useRoute();
  const params = _params as Params;
  const navToAmbassador = () => {
    const slug = header?.ambassador?.slug;
    if (!slug) return;
    Inertia.get(route("ambassador", { slug }));
  };
  return (
    <Layout
      {...p}
      modal={modal}
      backgroundImg={header?.heroImg?.src}
      backgroundFocus={header?.heroImg?.focus}
      avatarSrc={header?.ambassador?.avatar?.src}
      avatarFlip={header?.ambassador?.avatar?.orientation === "left"}
      title={header?.title}
      avatarColor="yellow"
      onClickAvatar={navToAmbassador}
      onClickSubtitle={navToAmbassador}
      subtitle={
        <span>
          <Trans
            ns="meal-plan"
            i18nKey="header.subtitle"
            values={{
              name: header?.ambassador?.shortName,
            }}
            components={{
              b: <strong />,
            }}
          ></Trans>
        </span>
      }
      button={
        startedToday ? (
          t("header.start-today.text")
        ) : (
          <Button
            onClick={() => {
              setModal(
                <SwitchMealPlanModal
                  slug={params.slug}
                  onClose={() => setModal(null)}
                  isRestart={isCurrent}
                  hasPlan={userHasMealPlan}
                />
              );
            }}
            color={"red"}
          >
            {t(
              isCurrent
                ? "header.button-restart.text"
                : "header.button-activate.text"
            )}
          </Button>
        )
      }
    >
      <PageContent>
        <GridItem className="story" area="story">
          <Markdown>{story || ""}</Markdown>
        </GridItem>
        {nutrition && <Nutrition nutrition={nutrition} area="nutrition" />}
        <GridItem className="content" area="content" dir="vertical">
          <H3>{t("example-recipes.title")}</H3>
          <Markdown className="text">{t("example-recipes.text")}</Markdown>
          <Days days={days || []} />
        </GridItem>
      </PageContent>
    </Layout>
  );
};

export default MealPlanPage;
