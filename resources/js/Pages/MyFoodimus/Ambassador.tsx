import React from "react";
import Grid, { GridItem } from "@/Components/foodimus/Grid";
import styled from "styled-components";
import headerContentWidth from "@/Theme/headerContentWidth";
import breakpoints from "@/Theme/breakpoints";
import { Avatar, Image, Auth, Ambassador } from "@/Types/page-data";
import useRoute from "@/Hooks/useRoute";
import { ThemeColor } from "@/Theme";
import Layout, { HeaderBoxContent } from "@/Layouts/AmbassadorPage";
import { Inertia } from "@inertiajs/inertia";
import MealPlanItem from "@/Partials/search/MealPlan";
import Markdown from "@/Components/foodimus/Markdown";
import { separatorColor } from "@/Components/foodimus/Separator";
import IconButton from "@/Components/foodimus/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { definition as faFacebookF } from "@fortawesome/free-brands-svg-icons/faFacebookF";
import { definition as faInstagram } from "@fortawesome/free-brands-svg-icons/faInstagram";

import { useTablet } from "@/Hooks/useMedia";
import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";
import { FlashProps } from "@/Partials/Flash";

const PageContent = styled(Grid).attrs(() => ({
  cols: {
    "default": [1],
    tablet: [1, 3],
    desktop: [1, 3],
  },
  areas: {
    "default": [{ name: "content", start: [0, 0] }],
    tablet: [
      { name: "story", start: [0, 0] },
      { name: "content", start: [1, 0] },
    ],
  },
}))`
  ${headerContentWidth};
  padding: 30px 0;
  gap: 50px;
  align-items: flex-start;
  @media ${breakpoints.tablet} {
    padding: 50px 0;
  }

  .story {
    display: none;
    @media ${breakpoints.tablet} {
      display: block;
    }
    border-top: solid thin ${({ theme }) => theme.colors[separatorColor]};
    padding: 1em 0;
    font-size: 16px;
    line-height: 25px;
    ul {
      margin-top: 0.25em;
      margin-bottom: 0.25em;
    }
    li {
      margin-top: 1.25em;
      margin-bottom: 1.25em;
    }
    .signature {
      display: flex;
      align-items: flex-end;
      gap: 10px;
      margin-top: 3em;
    }
    .social {
      margin-top: 2em;
      display: flex;
      gap: 10px;
    }
  }
`;

type MealPlanProps = {
  title: string;
  slug: string;
  totalDays: number;
  heroImg?: Image;
  ambassador?: Ambassador;
};
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

type Props = {
  auth: Auth;
  flash: FlashProps | null;
  header?: {
    backgroundColor: ThemeColor;
    logoColor: ThemeColor;
    ambassadorImg?: string;
    box: HeaderBoxContent;
  };
  ambassador?: {
    avatar?: Avatar;
    signature?: Image;
    instagramUrl: string;
    facebookUrl: string;
  };
  heroMealPlans?: MealPlanProps[];
  story?: string;
};

export const AmbassadorPage = ({
  header,
  heroMealPlans,
  story,
  ambassador,
  ...p
}: Props) => {
  const { params: _params, route } = useRoute();
  const horizontalMealplans = useTablet();
  return (
    <Layout
      {...p}
      backgroundColor={header?.backgroundColor}
      logoColor={header?.logoColor}
      ambassadorImg={header?.ambassadorImg}
      headerBoxContent={header?.box}
    >
      <PageContent>
        <GridItem area="story" className="story" dir="vertical">
          <Markdown>{story || ""}</Markdown>
          {ambassador && (
            <>
              <div className="signature">
                <Avatar
                  color="yellow"
                  flip={ambassador.avatar?.orientation === "left"}
                >
                  <img src={ambassador.avatar?.src} />
                </Avatar>
                <img src={ambassador.signature?.src} />
              </div>
              <div className="social">
                {!!ambassador.instagramUrl && (
                  <IconButton
                    onClick={() => {
                      window.open(ambassador.instagramUrl, "_blank");
                    }}
                    aria-label="Instagram"
                  >
                    <FontAwesomeIcon icon={faInstagram} />
                  </IconButton>
                )}
                {!!ambassador.facebookUrl && (
                  <IconButton
                    onClick={() => {
                      window.open(ambassador.facebookUrl, "_blank");
                    }}
                    aria-label="Facebook"
                  >
                    <FontAwesomeIcon icon={faFacebookF} />
                  </IconButton>
                )}
              </div>
            </>
          )}
        </GridItem>
        <GridItem
          area="content"
          dir={horizontalMealplans ? "vertical" : "horizontal"}
          gap={20}
        >
          {heroMealPlans?.map((i, ix) => {
            const navToMealPlan = () => {
              Inertia.get(route("meal-plan", { slug: i.slug }));
            };
            return (
              <MealPlanItem
                key={ix}
                layout={horizontalMealplans ? "horizontal" : "vertical"}
                heroImage={i.heroImg?.src}
                heroImageFocus={i.heroImg?.focus}
                title={i.title}
                totalDays={i.totalDays}
                avatarColor="green"
                ambassadorAvatar={i.ambassador?.avatar?.src}
                ambassadorName={i.ambassador?.name}
                flipAvatar={i.ambassador?.avatar?.orientation === "right"}
                buttonColor="purple"
                onClickTitle={navToMealPlan}
                onClickMoreInfo={navToMealPlan}
                onClickHeader={navToMealPlan}
                onClickTab={navToMealPlan}
                onClickAmbassador={undefined}
              />
            );
          })}
        </GridItem>
      </PageContent>
    </Layout>
  );
};

export default AmbassadorPage;
