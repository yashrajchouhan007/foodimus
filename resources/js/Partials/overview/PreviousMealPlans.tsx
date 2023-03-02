import Carousel from "@/Components/foodimus/Carousel";
import React, { MutableRefObject } from "react";
import styled from "styled-components";
import { mobilePageMargin, tabletPageMargin } from "@/Theme/headerContentWidth";
import { useDesktop } from "@/Hooks/useMedia";
import breakpoints from "@/Theme/breakpoints";
import PreviousMealPlan, { PreviousMealPlanProps } from "./PreviousMealPlan";
import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";

const StyledContainer = styled.div.withConfig(hidePropsFromHtml("height"))<{
  height: number;
}>`
  position: relative;
  height: ${({ height }) => height}px;
`;
const StyledCarouselContainer = styled.div`
  height: 100%;
  margin-left: -${mobilePageMargin}px;
  margin-right: -${mobilePageMargin}px;
  @media ${breakpoints.tablet} {
    margin-right: -${tabletPageMargin}px;
  }
`;

type Props = {
  carouselRef?: MutableRefObject<
    | undefined
    | {
        goToNext: () => void;
        goToPrev: () => void;
      }
  >;

  mealplans: (PreviousMealPlanProps & {
    id: number | string;
  })[];
};
export const PreviousMealPlans = ({ mealplans, carouselRef }: Props) => {
  const isDesktop = useDesktop();
  const itemSize = {
    width: 250,
    height: 423,
  };
  return (
    <StyledContainer height={426}>
      <StyledCarouselContainer>
        <Carousel
          fade={isDesktop ? "both" : "left"}
          leftMargin={mobilePageMargin}
          itemWidth={itemSize.width}
          itemHeight={itemSize.height}
          gap={50}
          carouselRef={carouselRef}
        >
          {mealplans.map(({ id, ...p }) => (
            <PreviousMealPlan key={id} {...p} />
          ))}
        </Carousel>
      </StyledCarouselContainer>
    </StyledContainer>
  );
};

export default PreviousMealPlans;
