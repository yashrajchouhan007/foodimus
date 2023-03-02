import React from "react";
import { useTranslation } from "react-i18next";
import Grid, { GridItem } from "@/Components/foodimus/Grid";
import styled from "styled-components";
import headerContentWidth from "@/Theme/headerContentWidth";
import breakpoints from "@/Theme/breakpoints";
import { TipProps, Auth } from "@/Types/page-data";
import Layout, { MealData } from "@/Layouts/MealPage";
import { H2 } from "@/Components/foodimus/typography/Headings";
import formatNumber from "@/Helpers/formatNumber";
import { FlashProps } from "@/Partials/Flash";
import BodyText from "@/Components/foodimus/typography/BodyText";

const Nutrient = styled.div`
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

type NutrientProps = {
  name: string;
  amount: number;
  unit?: string;
};
type Props = {
  flash: FlashProps | null;
  auth: Auth;
  meal?: MealData;
  nutrients?: NutrientProps[];
  tip?: TipProps;
};

export const NutritionPage = ({ nutrients, ...p }: Props) => {
  const { t } = useTranslation("meal");
  const amountFormatter = (p: NutrientProps): string => {
    const amount = formatNumber(t, p.amount, {
      maximumFractionDigits: 1,
      maximumSignificantDigits: 3,
    });

    return p.unit
      ? t("nutrient.amount.unit", {
          amount,
          unit: p.unit,
        })
      : amount;
  };
  return (
    <Layout {...p}>
      <StyledTextContainer>
        <H2>{t("nutrients.title")}</H2>
      </StyledTextContainer>
      {nutrients?.map((p, ix) => (
        <Nutrient key={ix}>
          <BodyText variant="bold" className="name">
            {p.name}
          </BodyText>
          <BodyText align="right" className="amount">
            {amountFormatter(p)}
          </BodyText>
        </Nutrient>
      ))}
    </Layout>
  );
};

export default NutritionPage;
