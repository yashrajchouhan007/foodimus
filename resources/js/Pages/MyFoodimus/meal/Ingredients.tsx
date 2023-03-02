import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import breakpoints from "@/Theme/breakpoints";
import { Auth, TipProps } from "@/Types/page-data";
import Layout, { MealData } from "@/Layouts/MealPage";
import { H2 } from "@/Components/foodimus/typography/Headings";
import BodyText from "@/Components/foodimus/typography/BodyText";
import formatFraction from "@/Helpers/formatFraction";
import { FlashProps } from "@/Partials/Flash";
import { Inertia } from "@inertiajs/inertia";
import Markdown from "@/Components/foodimus/Markdown";
import Button from "@/Components/foodimus/Button";
import useRoute from "@/Hooks/useRoute";
import formatIngredient from "@/Helpers/formatIngredient";

const Ingredient = styled.div`
  display: flex;
  align-items: center;
  &:not(:last-child) {
    border-bottom: solid thin ${({ theme }) => theme.colors.purpleA30};
  }
  padding: 15px 10px;
  gap: 10px;
  @media ${breakpoints.tablet} {
    gap: 18px;
    padding: 25px 10px;
  }
  .amount {
    min-width: 100px;
  }
  .name {
    flex: 1;
  }
`;
const StyledTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px 10px;
  gap: 10px;
  @media ${breakpoints.tablet} {
    gap: 18px;
    padding: 25px 10px;
  }
`;
const StyledBottomContainer = styled.div`
  display: flex;
  margin-top: 40px;
  flex-direction: column;
  align-items: flex-start;
  padding: 15px 10px;
  gap: 10px;
  @media ${breakpoints.tablet} {
    gap: 18px;
    padding: 25px 10px;
  }
`;
type IngredientProps = {
  name?: string;
  amount?: string;
  unit?: string;
};
type MealsData = {
  auth: Auth;
  flash: FlashProps | null;
  meal?: MealData;
  serves?: number;
  ingredients?: IngredientProps[];
  tip?: TipProps;
};
type Props = MealsData;

type Params = {
  date: string;
  slug: string;
};

export const IngredientsPage = ({ ingredients, serves, tip, ...p }: Props) => {
  const { t } = useTranslation("meal");
  const { route, params: _params } = useRoute();
  const params = _params as Params;
  const amountFormatter = (p: IngredientProps): string => {
    if (!p.amount) return "";
    if (isNaN(Number(p.amount))) return p.amount;
    return formatIngredient(t, Number(p.amount), p.unit);
  };

  return (
    <Layout {...p}>
      <StyledTextContainer>
        <H2>{t("ingredients.title")}</H2>
        {serves && (
          <BodyText>
            {t(`ingredients.serves.${serves > 2 ? 2 : serves}`, {
              amount: serves,
            })}
          </BodyText>
        )}
      </StyledTextContainer>
      {ingredients?.map((p, ix) => (
        <Ingredient key={ix}>
          <BodyText variant="bold" className="name">
            {p.name}
          </BodyText>
          <BodyText align="right" className="amount">
            {amountFormatter(p)}
          </BodyText>
        </Ingredient>
      ))}
      <StyledBottomContainer>
        <Markdown>{t("ingredients.shopping-list.content")}</Markdown>
        <Button
          color="green"
          onClick={() => {
            Inertia.get(route("shopping-list", params));
          }}
        >
          {t("ingredients.shopping-list.button.label")}
        </Button>
      </StyledBottomContainer>
    </Layout>
  );
};

export default IngredientsPage;
