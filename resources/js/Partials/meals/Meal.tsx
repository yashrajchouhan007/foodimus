import React from "react";
import { useTranslation } from "react-i18next";
import { GridItem } from "@/Components/foodimus/Grid";
import styled from "styled-components";
import breakpoints from "@/Theme/breakpoints";
import { ThemeColor } from "@/Theme";
import useRoute from "@/Hooks/useRoute";
import { Inertia } from "@inertiajs/inertia";

import ControlText from "@/Components/foodimus/typography/ControlText";
import MultilineText from "@/Components/foodimus/typography/MultilineText";
import MealIcon from "@/Components/foodimus/MealIcon";
import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";

export const StyledMealContainer = styled.div.withConfig(
  hidePropsFromHtml("growChild", "clickable", "borderBottom")
)<{
  growChild: number;
  clickable?: boolean;
  borderBottom?: boolean;
}>`
  display: flex;
  align-items: center;
  &:not(:last-child) {
    ${({ theme, borderBottom }) =>
      borderBottom && `border-bottom: solid thin ${theme.colors.purpleA30};`}
  }
  padding: 15px 10px;
  gap: 10px;
  ${({ clickable }) => clickable && `cursor: pointer;`}
  @media ${breakpoints.tablet} {
    gap: 18px;
    padding: 25px 10px;
  }
  *:nth-child(${({ growChild }) => growChild + 1}) {
    flex: 1;
  }
`;
export const CalorieBox = styled(GridItem)`
  font-size: 14px;
  padding: 10px 8px;
  justify-content: center;
  border-radius: 10px;
  min-width: 80px;
  border: solid thin ${({ theme }) => theme.colors.darkA40};
  font-family: ${({ theme }) => theme.fonts.controlBold};
`;
export const NutrientsBox = styled.div`
  font-size: 12px;
  line-height: 15px;
  display: none;
  width: 75px;
  @media ${breakpoints.tablet} {
    display: initial;
  }
`;

export type MealProps = {
  slug: string;
  mealType: string;
  mealIcon: "croissant" | "burger" | "apple" | "dinner";
  mealIconColor: ThemeColor;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};
type Props = MealProps & {
  showNutrients?: boolean;
};
export const Meal = ({
  slug,
  mealType,
  mealIcon,
  mealIconColor,
  name,
  calories,
  protein,
  carbs,
  fat,
  showNutrients,
}: Props) => {
  const { t } = useTranslation("meals");
  const { route, params } = useRoute();
  const { date } = params as { date: string };
  return (
    <StyledMealContainer
      clickable={true}
      growChild={1}
      borderBottom
      onClick={() => {
        Inertia.get(route("meal", { slug, date }));
      }}
    >
      <MealIcon color={mealIconColor} icon={mealIcon} />
      <div>
        <ControlText size="lg">{t(`common:meal-type.${mealType}`)}</ControlText>
        <ControlText size="lg" variant="bold">
          {name}
        </ControlText>
      </div>
      {showNutrients !== false && (
        <>
          <CalorieBox>{t("meals.item.calories", { calories })}</CalorieBox>
          <NutrientsBox>
            <MultilineText>
              {t("meals.item.nutrients", { protein, carbs, fat })}
            </MultilineText>
          </NutrientsBox>
        </>
      )}
    </StyledMealContainer>
  );
};

export default Meal;
