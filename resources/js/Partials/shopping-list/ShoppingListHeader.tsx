import React from "react";
import { Trans, useTranslation } from "react-i18next";
import styled from "styled-components";
import breakpoints from "@/Theme/breakpoints";
import MealIcon, { MealIconName } from "@/Components/foodimus/MealIcon";
import { ThemeColor } from "@/Theme";
import { H2, H4 } from "@/Components/foodimus/typography/Headings";
import { DateTime } from "luxon";
import DateSelector from "@/Partials/DateSelector";
import DateDescription from "../DateDescription";
import { GhostButton } from "@/Components/foodimus/Button";
import { definition as faCalendarAlt } from "@fortawesome/free-regular-svg-icons/faCalendarAlt";
import { definition as faCalendarCheck } from "@fortawesome/free-regular-svg-icons/faCalendarCheck";

import { definition as faFilter } from "@fortawesome/free-solid-svg-icons/faFilter";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PopupMenu, PopupMenuItem } from "@/Components/foodimus/PopupMenu";
import { formatRelative } from "@/Helpers/formatDate";
import useAutoClose from "@/Hooks/useAutoClose";

const StyledH2 = styled(H2)`
  .yellow {
    color: ${({ theme }) => theme.colors.yellow};
  }
  margin-bottom: 10px;
  @media ${breakpoints.tablet} {
    margin-right: 260px;
  }
`;
const DateContainer = styled(H4)`
  padding: 15px 0;
  .day {
    color: ${({ theme }) => theme.colors.purple};
    font-family: ${({ theme }) => theme.fonts.controlBold};
  }
  .date {
    font-family: ${({ theme }) => theme.fonts.control};
  }
`;
const SelectionContainer = styled.div`
  display: flex;
  gap: 40px;
  margin-bottom: 30px;
  @media ${breakpoints.tablet} {
    float: right;
    position: relative;
    top: -53px;
  }
`;
const FilterButton = styled(GhostButton)`
  display: flex;
  gap: 16px;
  align-items: center;
  height: 44px;
`;
const FilterContainer = styled.div`
  position: relative;
  .popup {
    left: 50%;
    margin-left: -115px;
}
  }
`;
const StyledPopupMenuItem = styled(PopupMenuItem).attrs(() => ({
  separators: true,
}))`
  position: relative;
  display: flex;
  gap: 20px;
  font-size: 18px;
`;
type FilterProps = {
  meals: Meal[];
  onChange: (p: { type: "meal" | "day" | "mealplan"; slug?: string }) => void;
};
const Filters = ({ meals, onChange }: FilterProps) => {
  const { t } = useTranslation("shopping-list");
  const [showFilters, setShowFilters] = useAutoClose();

  return (
    <FilterContainer>
      <PopupMenu className="popup" show={showFilters}>
        {meals.map((meal, ix) => (
          <StyledPopupMenuItem
            onClick={() => onChange({ type: "meal", slug: meal.slug })}
            key={ix}
          >
            <MealIcon
              size="medium"
              color={meal.mealIconColor}
              icon={meal.mealIcon}
            />
            {t(`common:meal-type.${meal.mealType}`)}
          </StyledPopupMenuItem>
        ))}
        <StyledPopupMenuItem onClick={() => onChange({ type: "day" })}>
          <MealIcon size="medium" color="blue" faIcon={faCalendarAlt} />

          {t("filter.today")}
        </StyledPopupMenuItem>
        <StyledPopupMenuItem onClick={() => onChange({ type: "mealplan" })}>
          <MealIcon size="medium" color="red" faIcon={faCalendarCheck} />
          {t("filter.meal-plan")}
        </StyledPopupMenuItem>
      </PopupMenu>
      <FilterButton onClick={() => setShowFilters(true)}>
        <FontAwesomeIcon icon={faFilter} />
        Filter
      </FilterButton>
    </FilterContainer>
  );
};

export type Meal = {
  slug: string;
  mealType: string;
  name: string;
  mealIcon: MealIconName;
  mealIconColor: ThemeColor;
};
export type Filter = {
  type: "mealplan" | "day" | "meal";
  date?: string;
  slug?: string;
};
type Props = {
  startDate: string;
  endDate: string;
  currentDate?: string;
  currentFilter: Filter;
  onChangeFilters: (p: Filter) => void;
  meals: Meal[];
  mealplanName: string;
};

export const ShoppingListHeader = ({
  startDate,
  endDate,
  meals,
  currentDate,
  onChangeFilters,
  currentFilter,
  mealplanName,
}: Props) => {
  const { t } = useTranslation("shopping-list");
  const minDate = DateTime.fromISO(startDate);
  const maxDate = DateTime.fromISO(endDate);
  const value =
    currentDate === undefined ? DateTime.now() : DateTime.fromISO(currentDate);

  return (
    <>
      <StyledH2>
        {currentFilter.type === "mealplan" ? (
          <Trans
            ns="shopping-list"
            i18nKey="title.mealplan"
            values={{
              name: mealplanName,
            }}
            components={{
              yellow: <div className="yellow" />,
            }}
          />
        ) : (
          <Trans
            ns="shopping-list"
            i18nKey="title.date"
            values={{
              day: formatRelative(t, value),
            }}
            components={{
              yellow: <div className="yellow" />,
            }}
          />
        )}
      </StyledH2>
      {currentFilter.type === "mealplan" ? (
        <></>
      ) : (
        <DateContainer>
          <DateDescription
            startDate={minDate}
            endDate={maxDate}
            activeDate={value}
          />
        </DateContainer>
      )}
      <SelectionContainer>
        <DateSelector
          minDate={minDate}
          maxDate={maxDate}
          value={value}
          onChange={(newDate) => {
            onChangeFilters({
              type: "day",
              date: newDate.toISODate(),
            });
          }}
        />
        <Filters
          meals={meals}
          onChange={({ type, slug }) => {
            if (type === "day") {
              onChangeFilters({
                type: "day",
                date:
                  (currentFilter.date !== "mealplan" && currentFilter.date) ||
                  DateTime.now().toISODate(),
              });
            } else if (type === "mealplan") {
              onChangeFilters({
                type: "mealplan",
              });
            } else if (type === "meal" && slug !== undefined) {
              onChangeFilters({
                type: "meal",
                slug,
                date:
                  (currentFilter.date !== "mealplan" && currentFilter.date) ||
                  DateTime.now().toISODate(),
              });
            }
          }}
        />
      </SelectionContainer>
    </>
  );
};

export default ShoppingListHeader;
