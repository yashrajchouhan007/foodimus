import Carousel from "@/Components/foodimus/Carousel";
import Directional from "@/Components/foodimus/Directional";
import Fill from "@/Components/foodimus/Fill";
import SlideUp from "@/Components/foodimus/SlideUp";
import { H3 } from "@/Components/foodimus/typography/Headings";
import { useTablet } from "@/Hooks/useMedia";
import Meal from "./Meal";
import breakpoints from "@/Theme/breakpoints";
import { mobilePageMargin } from "@/Theme/headerContentWidth";
import { definition as faCaretDown } from "@fortawesome/free-solid-svg-icons/faCaretDown";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { MealIconName } from "@/Components/foodimus/MealIcon";
import { Image } from "@/Types/page-data";
import { ThemeColor } from "@/Theme";

const Header = styled.div``;
const HeaderContent = styled.div``;
const StyledContainer = styled.div`
  .slide-up {
    margin-left: ${-mobilePageMargin}px;
    width: calc(100% + ${2 * mobilePageMargin}px);
    @media ${breakpoints.tablet} {
      width: calc(100% + ${mobilePageMargin}px);
    }
    & > .inner {
      padding-top: 30px;
    }
  }
  ${HeaderContent} {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 30px;
    h3 {
      position: relative;
      top: 3px;
    }
  }
  ${Header} {
    cursor: pointer;
    display: flex;
    flex-direction: row;
    height: 45px;
    align-items: center;
    color: ${({ theme }) => theme.colors.purple};
    .directional {
      display: none;
      @media ${breakpoints.tablet} {
        display: inline-block;
      }
      transition: opacity 150ms linear;
      opacity: 0;
      pointer-events: none;
      &.shown {
        opacity: 1;
        pointer-events: initial;
      }
    }
    .arrow {
      transition: transform 150ms linear;
      &.flipped {
        transform: rotate(180deg);
      }
    }
  }
`;

type MealData = {
  heroImage: Image;
  icon: MealIconName;
  iconColor?: ThemeColor;
  mealType: string;
  name: string;
  slug: string;
};
export type DayData = {
  day: number;
  meals: MealData[];
};

type Props = DayData & {
  open?: boolean;
  onToggle?: () => void;
};
export const Day = ({ day, meals, open, onToggle }: Props) => {
  //const { route } = useRoute();
  const { t } = useTranslation("meal-plan");
  const isTablet = useTablet();
  const fade = isTablet ? "both" : "none";
  const gap = isTablet ? 55 : 30;
  const carouselRef = useRef<{
    goToNext: () => void;
    goToPrev: () => void;
  }>();
  return (
    <StyledContainer className="day">
      <Header>
        <HeaderContent onClick={onToggle}>
          <H3>{t("day.title", { day: `${day}` })}</H3>
          <FontAwesomeIcon
            className={"arrow" + (open ? " flipped" : "")}
            icon={faCaretDown}
            size="lg"
          />
        </HeaderContent>
        <Fill />
        <Directional
          className={"directional" + (open ? " shown" : "")}
          onClickLeft={() => {
            carouselRef.current?.goToPrev();
          }}
          onClickRight={() => {
            carouselRef.current?.goToNext();
          }}
        />
      </Header>
      <SlideUp className="slide-up" open={!!open}>
        <Carousel
          carouselRef={carouselRef}
          gap={gap}
          className="carousel"
          fade={fade}
          leftMargin={mobilePageMargin}
          itemHeight={371}
          itemWidth={255}
        >
          {meals.map((i, ix) => (
            <Meal
              key={ix}
              heroImage={i.heroImage.src}
              heroImageFocus={i.heroImage.focus}
              icon={i.icon}
              iconColor={i.iconColor}
              mealType={i.mealType}
              name={i.name}
            />
          ))}
        </Carousel>
      </SlideUp>
    </StyledContainer>
  );
};

export default Day;
