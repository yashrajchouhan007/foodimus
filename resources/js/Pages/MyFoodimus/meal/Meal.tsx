import React from "react";
import { Auth, Image } from "@/Types/page-data";
import Layout, { MealData } from "@/Layouts/MealPage";
import Markdown from "@/Components/foodimus/Markdown";
import { useTranslation } from "react-i18next";
import { FlashProps } from "@/Partials/Flash";

type Props = {
  auth: Auth;
  flash: FlashProps | null;
  meal?: MealData;
  mealText?: string;
  mealPictures?: Image[];
};

export const MealPage = ({ mealText, mealPictures, ...p }: Props) => {
  const { t } = useTranslation("meal");
  return (
    <Layout {...p}>
      <Markdown>{mealText || t("info.no-text")}</Markdown>
    </Layout>
  );
};

export default MealPage;
