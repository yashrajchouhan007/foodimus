import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { H3 } from "@/Components/foodimus/typography/Headings";
import useRoute from "@/Hooks/useRoute";

import { DateTime } from "luxon";
import { Inertia } from "@inertiajs/inertia";

import ControlText from "@/Components/foodimus/typography/ControlText";
import MultilineText from "@/Components/foodimus/typography/MultilineText";
import { sum } from "@/Helpers/aggregate";
import Meal, {
  CalorieBox,
  MealProps,
  NutrientsBox,
  StyledMealContainer,
} from "./Meal";
import DateSelector from "../DateSelector";
import DateDescription from "../DateDescription";

const Title = styled(H3)`
  padding: 15px 0;
  .day {
    color: ${({ theme }) => theme.colors.purple};
    font-family: ${({ theme }) => theme.fonts.controlBold};
  }
  .date {
    font-family: ${({ theme }) => theme.fonts.control};
  }
`;
export type MealsProps = {
  currentMealPlan: {
    startDate: string;
    endDate: string;
  };
  currentDay: {
    meals: MealProps[];
  };
};
type Props = MealsProps & {
  showNutrients?: boolean;
  showDateControls?: boolean;
  currentDate: string;
};
export const Meals = ({
  currentMealPlan,
  currentDay,
  showNutrients,
  showDateControls,
  currentDate,
}: Props) => {
  const { t } = useTranslation("meals");
  const { route } = useRoute();

  const mealPlanStartDate = DateTime.fromISO(currentMealPlan.startDate);
  const mealPlanEndDate = DateTime.fromISO(currentMealPlan.endDate);
  const activeDate = DateTime.fromISO(currentDate);

  return (
    <>
      {showDateControls !== false && (
        <DateSelector
          minDate={mealPlanStartDate}
          maxDate={mealPlanEndDate}
          value={activeDate}
          onChange={(newDate) => {
            Inertia.get(
              route("meals", {
                date: newDate.toISODate(),
              }),
              undefined,
              { preserveScroll: true }
            );
          }}
        />
      )}
      <Title>
        <DateDescription
          startDate={mealPlanStartDate}
          endDate={mealPlanEndDate}
          activeDate={activeDate}
        />
      </Title>
      {currentDay.meals.map((meal, ix) => (
        <Meal key={ix} {...meal} showNutrients={showNutrients} />
      ))}
      {showNutrients !== false && (
        <StyledMealContainer growChild={0}>
          <ControlText size="lg" variant="bold">
            {t("meals.total.title")}
          </ControlText>
          <>
            <CalorieBox>
              {t("meals.item.calories", {
                calories: sum(currentDay.meals, "calories"),
              })}
            </CalorieBox>
            <NutrientsBox>
              <MultilineText>
                {t("meals.item.nutrients", {
                  protein: sum(currentDay.meals, "protein"),
                  carbs: sum(currentDay.meals, "carbs"),
                  fat: sum(currentDay.meals, "fat"),
                })}
              </MultilineText>
            </NutrientsBox>
          </>
        </StyledMealContainer>
      )}
    </>
  );
};

export default Meals;
