import React from "react";
import styled from "styled-components";
import headerContentWidth from "@/Theme/headerContentWidth";
import breakpoints from "@/Theme/breakpoints";
import { Auth } from "@/Types/page-data";
import BasicPage from "@/Layouts/BasicPage";
import ShoppingListHeader, {
  Filter,
  Meal,
} from "@/Partials/shopping-list/ShoppingListHeader";
import useRoute from "@/Hooks/useRoute";
import { Inertia } from "@inertiajs/inertia";
import { H3 } from "@/Components/foodimus/typography/Headings";
import Checkbox from "@/Components/foodimus/Checkbox";
import useShoppingList, { StateIdentifier } from "@/Hooks/useShoppingList";
import BodyText from "@/Components/foodimus/typography/BodyText";
import Separator from "@/Components/foodimus/Separator";
import { useTranslation } from "react-i18next";
import formatFraction from "@/Helpers/formatFraction";
import formatIngredient from "@/Helpers/formatIngredient";

const PageContent = styled.div`
  ${headerContentWidth};
  display: flex;
  flex-direction: column;
  padding: 30px 0;
  gap: 50px;
  @media ${breakpoints.tablet} {
    padding: 50px 0;
  }
`;
const ShoppingListContainer = styled.div`
  align-self: center;
  min-height: 100px;
  width: 100%;
  max-width: 900px;
  @media ${breakpoints.tablet} {
    background-color: white;
    box-shadow: 2px 3px 6px #0000000a;
    border-radius: 5px;
    padding: 60px 100px;
  }
`;
const ConditionalSeparator = styled(Separator)`
  display: none;
  margin-bottom: 30px;
  @media ${breakpoints.tablet} {
    display: block;
  }
`;

const StyledCheckbox = styled(Checkbox)`
  min-height: 50px;
  .label {
    position: relative;
    &:before {
      content: "";
      display: block;
      position: absolute;
      top: 50%;
      width: 0%;
      margin-top: -1px;
      height: 1px;
      background-color: ${({ theme }) => theme.colors.dark};
      transition: width 100ms ease-out;
    }
  }
  &.checked .label:before {
    width: 100%;
  }
`;

type ShoppingListItemProps = {
  amount: number;
  unit?: string;
  listItemIds: string[];
  name: string;
  id: string;
};
type ShoppingList = {
  mealName?: string;
  mealSlug?: string;
  items: ShoppingListItemProps[];
};
type ShoppingListItemsProps = {
  startDate: string;
  endDate: string;
  items: ShoppingListItemProps[];
  type: Filter["type"];
  date?: string;
  meal?: string;
};
const ShoppingListItems = ({
  startDate,
  endDate,
  items,
}: ShoppingListItemsProps) => {
  const { t } = useTranslation();
  const storedState = useShoppingList(startDate, endDate);
  const ingredientFormatter = (p: ShoppingListItemProps): string => {
    if (!p.amount) return p.name.replace(/^./, (i) => i.toUpperCase());
    if (isNaN(Number(p.amount)))
      return p.name.replace(/^./, (i) => i.toUpperCase());
    return formatIngredient(t, Number(p.amount), p.unit, p.name);
  };
  if (storedState === null) return <></>;
  return (
    <>
      {items.map((item, ix) => {
        const identifier: StateIdentifier = item.listItemIds;
        return (
          <StyledCheckbox
            key={ix}
            checked={storedState.isChecked(identifier)}
            onChange={(checked: boolean) => {
              storedState.setChecked(identifier, checked);
            }}
          >
            <BodyText size="xl">{ingredientFormatter(item)}</BodyText>
          </StyledCheckbox>
        );
      })}
    </>
  );
};

type Props = React.ComponentProps<typeof BasicPage> & {
  currentMealPlan?: {
    name: string;
    startDate: string;
    endDate: string;
  };
  currentDay?: {
    meals: Meal[];
  };
  shoppingLists?: ShoppingList[];
};
type Params = {
  date: string;
  slug?: string;
};
export const ShoppingListPage = ({
  currentMealPlan,
  currentDay,
  shoppingLists,
  ...p
}: Props) => {
  const { params: _params, route } = useRoute();
  const params = _params as Params;
  const filter: Filter =
    params.date === "mealplan"
      ? { type: "mealplan" }
      : params.slug
      ? { type: "meal", date: params.date, slug: params.slug }
      : { type: "day", date: params.date };

  return (
    <BasicPage {...p}>
      <PageContent>
        <ShoppingListContainer>
          {currentDay && currentMealPlan && (
            <ShoppingListHeader
              currentFilter={filter}
              onChangeFilters={({ type, date, slug }) => {
                switch (type) {
                  case "day":
                    if (!date) return;
                    return Inertia.get(
                      route("shopping-list", {
                        date,
                      }),
                      undefined,
                      { preserveScroll: true }
                    );
                  case "meal":
                    if (!date || !slug) return;
                    return Inertia.get(
                      route("shopping-list", {
                        date,
                        slug,
                      }),
                      undefined,
                      { preserveScroll: true }
                    );
                  case "mealplan":
                    return Inertia.get(
                      route("shopping-list", {
                        date: "mealplan",
                      }),
                      undefined,
                      { preserveScroll: true }
                    );
                }
              }}
              startDate={currentMealPlan.startDate}
              endDate={currentMealPlan.endDate}
              currentDate={params.date !== "mealplan" ? params.date : undefined}
              meals={currentDay.meals}
              mealplanName={currentMealPlan.name}
            />
          )}
          <ConditionalSeparator />
          {currentMealPlan &&
            shoppingLists?.map((shoppingList, ix) => (
              <React.Fragment key={ix}>
                {shoppingList.mealName && (
                  <H3 color="yellow">{shoppingList.mealName}</H3>
                )}
                <ShoppingListItems
                  startDate={currentMealPlan.startDate}
                  endDate={currentMealPlan.endDate}
                  items={shoppingList.items}
                  type={filter.type}
                  date={filter.date}
                  meal={filter.slug}
                ></ShoppingListItems>
              </React.Fragment>
            ))}
        </ShoppingListContainer>
      </PageContent>
    </BasicPage>
  );
};

export default ShoppingListPage;
