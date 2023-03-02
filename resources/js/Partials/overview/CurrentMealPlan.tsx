import BackgroundImage from "@/Components/foodimus/ResizeableImage";
import Button, { GhostButton } from "@/Components/foodimus/Button";
import ButtonContainer from "@/Components/foodimus/ButtonContainer";
import Grid, { GridItem } from "@/Components/foodimus/Grid";
import RoundedBox from "@/Components/foodimus/RoundedBox";
import RoundedHeader from "@/Components/foodimus/RoundedHeader";
import ControlText from "@/Components/foodimus/typography/ControlText";
import { H2, Heading } from "@/Components/foodimus/typography/Headings";
import MultilineText from "@/Components/foodimus/typography/MultilineText";
import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";
import responsive, { Responsive } from "@/Helpers/responsive";
import getSize, { Size } from "@/Helpers/size";
import { ThemeColor } from "@/Theme";
import breakpoints from "@/Theme/breakpoints";
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

export const Caption = styled(Heading).attrs((p) => ({
  as: p.as || "div",
}))`
  font-size: 18px;
  line-height: 28px;
`;
const StyledContainer = styled(RoundedBox)`
  width: 100%;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  position: relative;
`;
const Content = styled.div`
  padding: 20px;
  @media ${breakpoints.tablet} {
    padding: 20px 30px 30px;
  }
`;
const Tab = styled.div`
  font-family: ${({ theme }) => theme.fonts.control};
  font-size: 16px;
  line-height: 16px;
  left: 30px;
  position: absolute;
  z-index: 3;
  background-color: ${({ theme }) => theme.colors.red};
  color: ${({ theme }) => theme.colors.white};
  text-align: center;
  border-radius: 0 0 5px 5px;
  padding: 12px 13px 10px;
`;

const ProgressionBox = styled(Grid).attrs(() => ({
  cols: [1, "auto"],
  areas: [
    { name: "title", start: [0, 0] },
    { name: "progress", start: [1, 0] },
    { name: "bar", start: [0, 1], end: [1, 1] },
  ],
}))`
  margin: 10px 0 30px;
`;

const ProgressBar = styled.div.withConfig(
  hidePropsFromHtml("background", "color", "progress")
)<{
  background: ThemeColor;
  color: ThemeColor;
  progress: number;
}>`
  display: block;
  height: 9px;
  width: 100%;
  border-radius: 999px;
  background-color: ${({ theme, background }) => theme.colors[background]};
  position: relative;
  overflow: hidden;
  :before {
    content: "";
    display: block;
    border-radius: 999px;
    background-color: ${({ theme, color }) => theme.colors[color]};
    height: 100%;
    width: ${({ progress }) => progress * 100}%;
  }
`;

type CurrentMealPlanProps = {
  heroImage?: string;
  heroImageFocus?: [number, number];
  caption: string;
  title: string;
  currentDay: number;
  totalDays: number;
  onClickToday: () => void;
  onClickMoreInfo: () => void;
  onClickHeader: () => void;
  onClickCaption: () => void;
  onClickTitle: () => void;
};
export const CurrentMealPlan = ({
  heroImage,
  heroImageFocus,
  caption,
  title,
  currentDay,
  totalDays,
  onClickToday,
  onClickMoreInfo,
  onClickHeader,
  onClickCaption,
  onClickTitle,
}: CurrentMealPlanProps) => {
  const { t } = useTranslation("overview");
  return (
    <StyledContainer>
      <Tab>
        <MultilineText>
          {t(`current-mealplan.tab.days.${totalDays > 2 ? 2 : totalDays}`, {
            days: totalDays,
          })}
        </MultilineText>
      </Tab>
      <RoundedHeader
        cornerY={{
          "default": 0.9,
        }}
        onClick={onClickHeader}
      >
        <BackgroundImage
          src={heroImage}
          color="purple"
          focus={heroImageFocus}
          height={{
            "default": "223px",
          }}
        />
      </RoundedHeader>
      <Content>
        <Caption onClick={onClickCaption} color="purple">
          {caption}
        </Caption>
        <H2 onClick={onClickTitle}>{title}</H2>
        <ProgressionBox>
          <GridItem area="title">
            <ControlText size="lg">
              {t("current-mealplan.progress.title")}
            </ControlText>
          </GridItem>
          <GridItem area="progress">
            <ControlText>
              {t(
                `current-mealplan.progress.progress.${
                  totalDays > 2 ? 2 : totalDays
                }`,
                {
                  current: currentDay < 0 ? 0 : currentDay,
                  total: totalDays,
                }
              )}
            </ControlText>
          </GridItem>
          <GridItem area="bar">
            <ProgressBar
              background="background"
              color="redA70"
              progress={
                totalDays === 0
                  ? 1
                  : (currentDay < 0 ? 0 : currentDay) / totalDays
              }
            />
          </GridItem>
        </ProgressionBox>
        <ButtonContainer>
          <Button color="green" onClick={onClickToday}>
            {t("current-mealplan.button.today")}
          </Button>
          <GhostButton onClick={onClickMoreInfo}>
            {t("current-mealplan.button.info")}
          </GhostButton>
        </ButtonContainer>
      </Content>
    </StyledContainer>
  );
};

export default CurrentMealPlan;
