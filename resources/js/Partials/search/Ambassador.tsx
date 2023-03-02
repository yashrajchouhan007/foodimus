import BackgroundImage from "@/Components/foodimus/ResizeableImage";
import Button from "@/Components/foodimus/Button";
import Fill from "@/Components/foodimus/Fill";
import RoundedBox from "@/Components/foodimus/RoundedBox";
import RoundedHeader from "@/Components/foodimus/RoundedHeader";
import ControlText from "@/Components/foodimus/typography/ControlText";
import { H2 } from "@/Components/foodimus/typography/Headings";
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
`;
const Content = styled.div`
  flex: 1;
  position: relative;
  padding: 20px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
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

  width: 95px;
  height: 95px;
`;

const AvatarContainer = styled.div`
  ${({ onClick }) => !!onClick && `cursor: pointer;`}
  display: flex;
  flex-direction: column;
  align-self: stretch;
  gap: 15px;
  align-items: center;
  font-weight: 500;
  margin-top: -85px;
`;
export type MealPlanProps = {
  heroImage?: string;
  heroImageFocus?: [number, number];
  avatarColor: ThemeColor;
  ambassadorAvatar?: string;
  ambassadorName: string;
  flipAvatar?: boolean;
  title: string;
  onClickTitle: undefined | (() => void);
  onClickMoreInfo: undefined | (() => void);
  onClickHeader: undefined | (() => void);
  onClickAvatar: undefined | (() => void);
};
export const Ambassador = ({
  heroImage,
  heroImageFocus,
  title,
  avatarColor,
  ambassadorAvatar,
  ambassadorName,
  flipAvatar,
  onClickTitle,
  onClickMoreInfo,
  onClickHeader,
  onClickAvatar,
}: MealPlanProps) => {
  const { t } = useTranslation("search");
  return (
    <StyledContainer>
      <RoundedHeader
        onClick={onClickHeader}
        cornerY={{
          "default": 0.9,
        }}
      >
        <BackgroundImage
          src={heroImage}
          color="purple"
          focus={heroImageFocus}
          height={{
            "default": "165px",
          }}
        />
      </RoundedHeader>
      <Content>
        <AvatarContainer onClick={onClickAvatar}>
          <Avatar flip={flipAvatar || false} color={avatarColor}>
            <img src={ambassadorAvatar} />
          </Avatar>
        </AvatarContainer>
        <button onClick={onClickTitle}>
          <H2>{ambassadorName}</H2>
          <ControlText size="lg" color="red">
            {title}
          </ControlText>
        </button>
        <Fill />
        <Button color="green" onClick={onClickMoreInfo}>
          {t("ambassador.item.button.moreinfo")}
        </Button>
      </Content>
    </StyledContainer>
  );
};

export default Ambassador;
