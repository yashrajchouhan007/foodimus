import BackgroundImage from "@/Components/foodimus/ResizeableImage";
import Button from "@/Components/foodimus/Button";
import Fill from "@/Components/foodimus/Fill";
import RoundedBox from "@/Components/foodimus/RoundedBox";
import RoundedHeader from "@/Components/foodimus/RoundedHeader";
import Separator from "@/Components/foodimus/Separator";
import { H3 } from "@/Components/foodimus/typography/Headings";
import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";
import responsive, { Responsive } from "@/Helpers/responsive";
import getSize, { Size } from "@/Helpers/size";
import { ThemeColor } from "@/Theme";
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const StyledContainer = styled(RoundedBox)`
  user-select: none;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  position: relative;
  opacity: 0.5;
  transition: opacity 250ms linear;
  @media (hover: hover) {
    &:hover {
      opacity: 1;
    }
  }
`;
const Content = styled.div`
  flex: 1;
  padding: 20px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  .separator {
    margin: 15px 0;
  }
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
export type PreviousMealPlanProps = {
  heroImage?: string;
  heroImageFocus?: [number, number];
  avatarColor: ThemeColor;
  ambassadorAvatar?: string;
  ambassadorName?: string;
  flipAvatar?: boolean;
  title: string;
  totalDays: number;
  onClickTitle: undefined | (() => void);
  onClickActivate: undefined | (() => void);
  onClickHeader: undefined | (() => void);
  onClickTab: undefined | (() => void);
  onClickAmbassador: undefined | (() => void);
};
export const PreviousMealPlan = ({
  heroImage,
  heroImageFocus,
  title,
  totalDays,
  avatarColor,
  ambassadorAvatar,
  ambassadorName,
  flipAvatar,
  onClickTitle,
  onClickActivate,
  onClickHeader,
  onClickTab,
  onClickAmbassador,
}: PreviousMealPlanProps) => {
  const { t } = useTranslation("overview");
  return (
    <StyledContainer>
      <Tab onClick={onClickTab}>
        <MultilineText>
          {t(`current-mealplan.tab.days.${totalDays > 2 ? 2 : totalDays}`, {
            days: totalDays,
          })}
        </MultilineText>
      </Tab>
      <RoundedHeader
        onClick={onClickHeader}
        cornerY={{
          "default": 0.9,
        }}
      >
        <BackgroundImage
          src={heroImage}
          focus={heroImageFocus}
          color="purple"
          height={{
            "default": "165px",
          }}
        />
      </RoundedHeader>
      <Content>
        <AvatarContainer onClick={onClickAmbassador}>
          <Avatar flip={flipAvatar || false} color={avatarColor}>
            <img src={ambassadorAvatar} />
          </Avatar>
          <span>{ambassadorName}</span>
        </AvatarContainer>
        <Separator color="purpleA40" />
        <button onClick={onClickTitle}>
          <H3>{title}</H3>
        </button>
        <Fill />
        <Button color="red" onClick={onClickActivate}>
          {t("previous-mealplan.button.activate")}
        </Button>
      </Content>
    </StyledContainer>
  );
};

export default PreviousMealPlan;
