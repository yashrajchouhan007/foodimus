import React from "react";
import { useTranslation } from "react-i18next";
import { GridItem } from "@/Components/foodimus/Grid";
import styled from "styled-components";
import breakpoints from "@/Theme/breakpoints";
import { Image, TipProps, Auth } from "@/Types/page-data";
import { MealsProps } from "@/Partials/meals/Meals";
import Layout, { MealData } from "@/Layouts/MealPage";
import { H2, H3 } from "@/Components/foodimus/typography/Headings";
import Markdown from "@/Components/foodimus/Markdown";
import { FlashProps } from "@/Partials/Flash";
import BodyText from "@/Components/foodimus/typography/BodyText";
import formatFraction from "@/Helpers/formatFraction";

const Step = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px 0;
  &:not(:last-child) {
    border-bottom: solid thin ${({ theme }) => theme.colors.purpleA30};
  }
`;
export const PictureContainer = styled(GridItem)`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 9px;
  @media ${breakpoints.tablet} {
    gap: 16px;
  }
`;
type PageData = {
  flash: FlashProps | null;
  auth: Auth;
  meal?: MealData;
  steps?: string[];
  mealPictures?: Image[];
  tip?: TipProps;
} & Partial<MealsProps>;
type Props = PageData;

export const RecipePage = ({ steps, ...p }: Props) => {
  const { t } = useTranslation("meal");
  const { servings, recipeServings } = p.meal || {};
  return (
    <Layout {...p}>
      <H2>{t("recipe.title")}</H2>
      {servings && recipeServings && servings / recipeServings !== 1 && (
        <Markdown>
          {t("recipe.servings", {
            scale: formatFraction(t, servings / recipeServings),
          })}
        </Markdown>
      )}
      {steps?.map((step, ix) => (
        <Step key={ix}>
          <H3 color="red">{t("recipe.step.title", { step: ix + 1 })}</H3>
          <Markdown>{step}</Markdown>
        </Step>
      ))}
    </Layout>
  );
};

export default RecipePage;
