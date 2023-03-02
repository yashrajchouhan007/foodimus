import React from "react";
import Grid, { GridItem } from "@/Components/foodimus/Grid";
import Tip from "@/Partials/Tip";
import styled from "styled-components";
import headerContentWidth from "@/Theme/headerContentWidth";
import breakpoints from "@/Theme/breakpoints";
import { Ambassador, Auth } from "@/Types/page-data";
import useRoute from "@/Hooks/useRoute";
import LogoDetail from "-!react-svg-loader!@img/logo-detail.svg";
import Meals, { MealsProps } from "@/Partials/meals/Meals";
import BasicPage from "@/Layouts/BasicPage";
import { FlashProps } from "@/Partials/Flash";

const PageContent = styled(Grid).attrs(() => ({
  cols: {
    "default": [1],
    tablet: ["560px", 1],
  },
  areas: {
    "default": [{ name: "meals", start: [0, 0] }],
    tablet: [
      { name: "meals", start: [0, 0] },
      { name: "logo", start: [1, 0] },
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
const LogoContainer = styled(GridItem)`
  display: none;
  justify-content: center;
  align-items: flex-end;
  color: ${({ theme }) => theme.colors.backgroundD10};
  @media ${breakpoints.laptop} {
    display: flex;
  }
  svg {
    max-height: 650px;
  }
`;

type MealsData = {
  flash: FlashProps | null;
  auth: Auth;
  tip?: {
    ambassador: Ambassador;
    ambassadorTitle: string;
    text: string;
  };
} & Partial<MealsProps>;
type Props = MealsData;
type Params = {
  date: string;
};
export const MealsPage = ({
  currentDay,
  currentMealPlan,
  tip,
  ...p
}: Props) => {
  const { params: _params } = useRoute();
  const params = _params as Params;
  return (
    <BasicPage {...p}>
      {tip && <Tip {...tip} />}
      <PageContent>
        <GridItem area="meals" dir="vertical">
          {currentDay && currentMealPlan && (
            <Meals
              currentDate={params.date}
              currentDay={currentDay}
              currentMealPlan={currentMealPlan}
            />
          )}
        </GridItem>
        <LogoContainer area="logo" dir="vertical" gap={30}>
          <LogoDetail />
        </LogoContainer>
      </PageContent>
    </BasicPage>
  );
};

export default MealsPage;
