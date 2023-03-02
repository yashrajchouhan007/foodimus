import BackgroundImage from "@/Components/foodimus/ResizeableImage";
import Button from "@/Components/foodimus/Button";
import Fill from "@/Components/foodimus/Fill";
import RoundedBox from "@/Components/foodimus/RoundedBox";
import RoundedHeader from "@/Components/foodimus/RoundedHeader";
import Separator from "@/Components/foodimus/Separator";
import { H2, H3 } from "@/Components/foodimus/typography/Headings";
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
const Tab = styled.div`
  ${({ onClick }) => !!onClick && `cursor: pointer;`}
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
const Avatar = styled.div.withConfig(hidePropsFromHtml("color", "flip"))<{
  color: ThemeColor;
  flip: boolean;
}>`
  border-radius: 999px;
  overflow: hidden;
  background-color: ${({ theme, color }) => theme.colors[color]};
  img {
    width: 100%;
  }
  ${({ flip }) => flip && `transform: scale(-1,1);`}

  width: 52px;
  height: 52px;
`;

const MultilineText = ({ children }: { children: string }) => (
  <>
    {children.split("\n").map((line, ix) => (
      <div key={ix}>{line}</div>
    ))}
  </>
);

const AvatarContainer = styled.div`
  ${({ onClick }) => !!onClick && `cursor: pointer;`}
  display: flex;
  flex-direction: row;
  gap: 15px;
  align-items: center;
  font-weight: 500;
`;
export type MealPlanProps = {
  heroImage?: string;
  heroImageFocus?: [number, number];
  avatarColor: ThemeColor;
  ambassadorAvatar?: string;
  ambassadorName?: string;
  flipAvatar?: boolean;
  title: string;
  totalDays: number;
  buttonColor?: ThemeColor;
  layout?: "vertical" | "horizontal";
  onClickTitle: undefined | (() => void);
  onClickMoreInfo: undefined | (() => void);
  onClickHeader: undefined | (() => void);
  onClickAmbassador: undefined | (() => void);
  onClickTab: undefined | (() => void);
};
export const MealPlan = ({
  heroImage,
  heroImageFocus,
  title,
  totalDays,
  avatarColor,
  ambassadorAvatar,
  ambassadorName,
  flipAvatar,
  buttonColor,
  layout,
  onClickTitle,
  onClickMoreInfo,
  onClickHeader,
  onClickAmbassador,
  onClickTab,
}: MealPlanProps) => {
  const { t } = useTranslation("search");
  return (
    <StyledContainer orientation={layout || "vertical"}>
      <Tab onClick={onClickTab}>
        <MultilineText>
          {t(`meal-plan.item.tab.days.${totalDays > 2 ? 2 : totalDays}`, {
            days: totalDays,
          })}
        </MultilineText>
      </Tab>
      <div className="inner-container">
        <RoundedHeader
          onClick={onClickHeader}
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
            height={{
              "default": "100%",
            }}
          />
        </RoundedHeader>
        <Content className="content">
          <AvatarContainer onClick={onClickAmbassador}>
            <Avatar flip={flipAvatar || false} color={avatarColor}>
              <img src={ambassadorAvatar} />
            </Avatar>
            <span>{ambassadorName}</span>
          </AvatarContainer>
          <Separator color="purpleA40" />
          <button onClick={onClickTitle}>
            {layout === "horizontal" ? <H2>{title}</H2> : <H3>{title}</H3>}
          </button>
          <Fill />
          <Button color={buttonColor || "purple"} onClick={onClickMoreInfo}>
            {t("meal-plan.item.button.moreinfo")}
          </Button>
        </Content>
      </div>
    </StyledContainer>
  );
};

export default MealPlan;
