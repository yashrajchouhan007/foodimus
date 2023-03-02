import { GridItem } from "@/Components/foodimus/Grid";
import styled from "styled-components";
import { H3, H4 } from "@/Components/foodimus/typography/Headings";
import SlideUp from "@/Components/foodimus/SlideUp";
import { useTablet } from "@/Hooks/useMedia";
import Separator from "@/Components/foodimus/Separator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { definition as faCaretDown } from "@fortawesome/free-solid-svg-icons/faCaretDown";

import React, { useState } from "react";
import breakpoints from "@/Theme/breakpoints";
import { useTranslation } from "react-i18next";
import range from "@/Helpers/range";
import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";

const StyledContainer = styled(GridItem)`
  border: solid thin ${({ theme }) => theme.colors.green};
  border-radius: 10px;
  padding: 20px 20px 14px;
  font-size: 14px;
  line-height: 23px;
  width: 250px;
  align-self: flex-start;
  @media ${breakpoints.tablet} {
    padding: 26px 26px 20px;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .arrow {
      margin-top: -5px;
      transition: transform 150ms linear;
      &.flipped {
        transform: rotate(180deg);
      }
    }
  }
  .content > .inner {
    padding-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
    .nutrients-table {
      td {
        padding-right: 1em;
      }
    }
    .calories {
      border: solid thin ${({ theme }) => theme.colors.greenA50};
      margin-top: 10px;
      border-radius: 10px;
      padding: 15px 8px;
      font-family: ${({ theme }) => theme.fonts.controlBold};
      display: inline-block;
    }
  }
`;

const CookingLevel = styled.div.withConfig(hidePropsFromHtml("level"))<{
  level: 0 | 1 | 2 | 3;
}>`
  :before {
    color: ${({ theme }) => theme.colors.red};
    content: "${({ level }) =>
      range(3)
        .map((_, i) => (level > i ? "\u25CF" : "\u25CB"))
        .join("")}";
  }
`;
export type NutritionData = {
  nutrition: {
    averageNutrients?: {
      protein: number;
      carbs: number;
      fat: number;
      fiber: number;
      calories: number;
    };
    cookingLevel?: 0 | 1 | 2 | 3;
    averageCookingMinutes?: number;
    averagePortions?: number;
    category?: string;
    allergens?: string[];
  };
};
type Props = React.ComponentProps<typeof StyledContainer> & NutritionData;
export const Nutrition = ({ nutrition, ...p }: Props) => {
  const {
    averageNutrients,
    cookingLevel,
    averageCookingMinutes,
    averagePortions,
    category,
    allergens,
  } = nutrition;
  const { t } = useTranslation("meal-plan");
  const format = (key: string, value: number) => {
    if (Math.round(value) !== value) return t(`${key}.d`, { value });
    if (value === 0) return t(`${key}.0`, { value });
    if (value === 1) return t(`${key}.1`, { value });
    return t(`${key}.2`, { value });
  };
  const nutritionSlideable = !useTablet();
  const [_nutritionShown, setNutritionShown] = useState(false);
  const nutritionShown = !nutritionSlideable || _nutritionShown;

  return (
    <StyledContainer {...p} dir="vertical">
      <button
        onClick={() => {
          if (!nutritionSlideable) return;
          setNutritionShown(!nutritionShown);
        }}
        className="header"
      >
        <H3>{t("nutrition.title")}</H3>
        {nutritionSlideable && (
          <FontAwesomeIcon
            className={"arrow" + (nutritionShown ? " flipped" : "")}
            icon={faCaretDown}
          />
        )}
      </button>
      <SlideUp className="content" open={nutritionShown}>
        {averageNutrients && (
          <div className="section">
            <H4>{t("nutrition.section-average.title")}</H4>
            <table className="nutrients-table">
              <tbody>
                <tr>
                  <td>
                    {format(
                      "nutrition.section-average.protein.format",
                      averageNutrients.protein
                    )}
                  </td>
                  <td>{t("nutrition.section-average.protein.name")}</td>
                </tr>
                <tr>
                  <td>
                    {format(
                      "nutrition.section-average.carbs.format",
                      averageNutrients.carbs
                    )}
                  </td>
                  <td>{t("nutrition.section-average.carbs.name")}</td>
                </tr>
                <tr>
                  <td>
                    {format(
                      "nutrition.section-average.fat.format",
                      averageNutrients.fat
                    )}
                  </td>
                  <td>{t("nutrition.section-average.fat.name")}</td>
                </tr>
                <tr>
                  <td>
                    {format(
                      "nutrition.section-average.fiber.format",
                      averageNutrients.fiber
                    )}
                  </td>
                  <td>{t("nutrition.section-average.fiber.name")}</td>
                </tr>
              </tbody>
            </table>
            <div className="calories">
              {format(
                "nutrition.section-average.calories.format",
                averageNutrients.calories
              )}
            </div>
          </div>
        )}
        {averageCookingMinutes !== undefined && (
          <>
            <Separator />
            <div className="section">
              <H4>{t("nutrition.section-cooking-time.title")}</H4>
              <div>
                {format(
                  "nutrition.section-cooking-time.format",
                  averageCookingMinutes
                )}
              </div>
            </div>
          </>
        )}
        {cookingLevel !== undefined && (
          <>
            <Separator />
            <div className="section">
              <H4>{t("nutrition.section-cooking-level.title")}</H4>
              <CookingLevel level={cookingLevel} />
            </div>
          </>
        )}
        {category !== undefined && (
          <>
            <Separator />
            <div className="section">
              <H4>{t("nutrition.section-category.title")}</H4>
              <div>{category}</div>
            </div>
          </>
        )}
        {averagePortions !== undefined && (
          <>
            <Separator />
            <div className="section">
              <H4>{t("nutrition.section-average-portions.title")}</H4>
              <div>
                {format(
                  "nutrition.section-average-portions.format",
                  averagePortions
                )}
              </div>
            </div>
          </>
        )}
        {allergens !== undefined && (
          <>
            <Separator />
            <div className="section">
              <H4>{t("nutrition.section-allergies.title")}</H4>
              {allergens.map((n, ix) => (
                <div key={ix}>{n}</div>
              ))}
            </div>
          </>
        )}
      </SlideUp>
    </StyledContainer>
  );
};

export default Nutrition;
