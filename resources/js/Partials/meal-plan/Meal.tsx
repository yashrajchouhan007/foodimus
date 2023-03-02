import BackgroundImage from "@/Components/foodimus/ResizeableImage";
import Button from "@/Components/foodimus/Button";
import Fill from "@/Components/foodimus/Fill";
import MealIcon, { MealIconName } from "@/Components/foodimus/MealIcon";
import RoundedBox from "@/Components/foodimus/RoundedBox";
import RoundedHeader from "@/Components/foodimus/RoundedHeader";
import Separator from "@/Components/foodimus/Separator";
import ControlText from "@/Components/foodimus/typography/ControlText";
import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";
import responsive, { Responsive } from "@/Helpers/responsive";
import getSize, { Size } from "@/Helpers/size";
import { ThemeColor } from "@/Theme";
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const StyledContainer = styled(RoundedBox).withConfig(
  hideProps("orientation")
)<{
  orientation: "vertical" | "horizontal";
}>`
  user-select: none;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  position: relative;
  .inner-container {
    height: 100%;
    display: flex;
    ${({ orientation }) =>
      orientation === "vertical" &&
      `
    flex-direction: column;
    .header{
        height: 165px;
    }
    `}
    ${({ orientation }) =>
      orientation === "horizontal" &&
      `
    flex-direction: row-reverse;
    .header{
        width: 60%;
    }
    .content{
        padding-top: 84px;
        min-width:300px;
    }
    `}
  }
`;
const Content = styled.div`
  flex: 1;
  padding: 20px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;

const TextContainer = styled.button`
  ${({ onClick }) => !onClick && `cursor: default;`}
  display: flex;
  flex-direction: row;
  gap: 15px;
  align-items: center;
  font-weight: 500;
  line-height: 20px;
  .text {
    flex: 1;
  }
`;
export type MealProps = {
  heroImage?: string;
  heroImageFocus?: [number, number];
  iconColor?: ThemeColor;
  icon: MealIconName;
  mealType?: string;
  name: string;
  buttonColor?: ThemeColor;
  layout?: "vertical" | "horizontal";

  onClickTitle?: () => void;
  onClickMoreInfo?: () => void;
};
export const Meal = ({
  heroImage,
  heroImageFocus,
  iconColor,
  icon,
  mealType,
  name,
  layout,
  buttonColor,
  onClickTitle,
  onClickMoreInfo,
}: MealProps) => {
  const { t } = useTranslation("meal-plan");
  return (
    <StyledContainer orientation={layout || "vertical"}>
      <div className="inner-container">
        <RoundedHeader
          className="header"
          side={layout === "horizontal" ? "left" : "bottom"}
          cornerY={{
            "default": 0.9,
          }}
        >
          <BackgroundImage
            src={heroImage}
            color="purple"
            focus={heroImageFocus}
            height={"100%"}
            width={"100%"}
          />
        </RoundedHeader>
        <Content className="content">
          <TextContainer onClick={onClickTitle}>
            <MealIcon color={iconColor || "red"} icon={icon} />
            <div className="text">
              <ControlText size="lg">
                {t(`common:meal-type.${mealType}`)}
              </ControlText>
              <ControlText size="lg" variant="bold">
                {name}
              </ControlText>
            </div>
          </TextContainer>
          <Fill />
          {onClickMoreInfo && (
            <>
              <Separator color="purpleA40" />
              <Button
                color={buttonColor || "lightGrey"}
                hoverColor={
                  buttonColor !== undefined ? undefined : "lightGreyL10"
                }
                activeColor={
                  buttonColor !== undefined ? undefined : "lightGreyL5"
                }
                onClick={onClickMoreInfo}
              >
                {t("meal.button-more-info.text")}
              </Button>
            </>
          )}
        </Content>
      </div>
    </StyledContainer>
  );
};

export default Meal;
