import React from "react";
import { withTheme } from "styled-components";
import { Theme, ThemeColor } from "@/Theme";

import { GridItem } from "@/Components/foodimus/Grid";
import RoundedBox from "@/Components/foodimus/RoundedBox";
import AmbassadorOnLogo from "@/Components/foodimus/AmbassadorOnLogo";

import InnerHeader from "../Components/foodimus/header-parts/Header";
import HeaderContent from "../Components/foodimus/header-parts/HeaderContent";
import MealHeaderTitle from "../Components/foodimus/header-parts/MealHeaderTitle";
import PageHeaderTitle from "../Components/foodimus/header-parts/PageHeaderTitle";
import MealplanHeaderTitle from "../Components/foodimus/header-parts/MealplanHeaderTitle";
import HeaderAvatar from "../Components/foodimus/header-parts/HeaderAvatar";
import HeaderOverlay from "../Components/foodimus/header-parts/HeaderOverlay";
import HeaderMealIcon from "../Components/foodimus/header-parts/HeaderMealIcon";
import ErrorBoundary from "@/Components/foodimus/ErrorBoundary";
import { UserHeaderMenuLink } from "./UserHeaderMenu";
import { Auth } from "@/Types/page-data";

const Header = (p: React.ComponentProps<typeof InnerHeader>) => (
  <ErrorBoundary errorMessage={<InnerHeader />}>
    <InnerHeader {...p} />
  </ErrorBoundary>
);

type GuestHeaderProps = Omit<JSX.IntrinsicElements["div"], "title">;
export const GuestHeader = (p: GuestHeaderProps) => (
  <Header guest={true} {...p} />
);
type SmallHeaderProps = {
  auth?: Auth;
} & Omit<JSX.IntrinsicElements["div"], "title">;
export const SmallHeader = (p: SmallHeaderProps) => <Header {...p} />;

type PageHeaderProps = SmallHeaderProps & {
  backgroundImg?: string;
  backgroundFocus?: [number, number];
  title: React.ReactNode;
  subtitle: React.ReactNode;
};
export const PageHeader = ({
  backgroundImg,
  backgroundFocus,
  title,
  subtitle,
  ...p
}: PageHeaderProps) => (
  <Header
    {...p}
    background={backgroundImg}
    backgroundFocus={backgroundFocus}
    variant="medium"
  >
    <HeaderContent>
      <GridItem area="left">
        <PageHeaderTitle title={title} subtitle={subtitle} />
      </GridItem>
    </HeaderContent>
  </Header>
);

type MealHeaderProps = SmallHeaderProps & {
  backgroundImg?: string;
  backgroundFocus?: [number, number];
  iconColor: ThemeColor;
  ambassadorImg?: string;
  children?: React.ReactNode;
  title: React.ReactNode;
  subtitle: React.ReactNode;
  icon: React.ReactNode;
};
export const MealHeader = ({
  backgroundImg,
  backgroundFocus,
  ambassadorImg,
  children,
  title,
  subtitle,
  icon,
  iconColor,
  ...p
}: MealHeaderProps) => {
  let backgroundColor: ThemeColor | undefined = undefined;
  let logoColor: ThemeColor = "yellow";

  if (!backgroundImg) {
    switch (iconColor) {
      case "red":
        backgroundColor = "purple";
        logoColor = "yellow";
        break;
      case "yellow":
        backgroundColor = "purple";
        logoColor = "red";
        break;
      case "green":
        backgroundColor = "purple";
        logoColor = "yellow";
        break;
      case "purple":
        backgroundColor = "red";
        logoColor = "yellow";
        break;
      case "pink":
        backgroundColor = "purple";
        logoColor = "red";
        break;
    }
  }

  return (
    <Header
      {...p}
      background={backgroundImg}
      backgroundColor={backgroundColor}
      backgroundFocus={backgroundFocus}
      variant="large"
      menu={children}
    >
      <HeaderContent>
        <GridItem area="left">
          <MealHeaderTitle
            icon={
              <HeaderMealIcon themeColor={iconColor}>{icon}</HeaderMealIcon>
            }
            title={title}
            subtitle={subtitle}
          />
        </GridItem>
        <GridItem area="right">
          <AmbassadorOnLogo
            size={"sm"}
            imageSrc={ambassadorImg}
            themeColor={logoColor}
          />
        </GridItem>
      </HeaderContent>
    </Header>
  );
};

type MealPlanHeaderProps = SmallHeaderProps & {
  backgroundImg?: string;
  backgroundColor: ThemeColor;
  backgroundFocus?: [number, number];
  avatarColor: ThemeColor;
  ambassadorAvatar: string;
  ambassadorAvatarFlip?: boolean;
  title: React.ReactNode;
  subtitle: React.ReactNode;
  button: React.ReactNode;
  onClickAvatar?: () => void;
  onClickTitle?: () => void;
  onClickSubtitle?: () => void;
};
export const MealPlanHeader = ({
  backgroundImg,
  backgroundColor,
  backgroundFocus,
  avatarColor,
  ambassadorAvatar,
  ambassadorAvatarFlip,
  title,
  subtitle,
  button,
  onClickAvatar,
  onClickTitle,
  onClickSubtitle,
  ...p
}: MealPlanHeaderProps) => (
  <Header
    {...p}
    background={backgroundImg}
    backgroundFocus={backgroundFocus}
    backgroundColor={backgroundColor}
    variant="large"
  >
    <HeaderContent cols={[1, "auto", "auto"]}>
      <GridItem area="left">
        <MealplanHeaderTitle
          onClickIcon={onClickAvatar}
          onClickTitle={onClickTitle}
          onClickSubtitle={onClickSubtitle}
          icon={
            <HeaderAvatar
              flipped={!!ambassadorAvatarFlip}
              themeColor={avatarColor}
            >
              <img src={ambassadorAvatar} />
            </HeaderAvatar>
          }
          title={title}
          subtitle={subtitle}
          button={button}
        />
      </GridItem>
    </HeaderContent>
  </Header>
);

type AmbassadorHeaderProps = SmallHeaderProps & {
  backgroundColor: ThemeColor;
  logoColor: ThemeColor;
  ambassadorImg?: string;
  children?: React.ReactNode;
  theme: Theme;
};
export const AmbassadorHeader = withTheme(
  ({
    backgroundColor,
    logoColor,
    ambassadorImg,
    children,
    theme,
    ...p
  }: AmbassadorHeaderProps) => (
    <Header
      {...p}
      height={{
        "default": "520px",
      }}
      background={theme.colors[backgroundColor]}
      variant="large"
      backgroundHeight={{
        "default": "380px",
        tablet: "520px",
      }}
      overlay={
        <HeaderOverlay
          cols={{
            "default": ["254px", "auto"],
            tablet: ["auto", "399px", "10vw"],
          }}
          rows={{
            "default": ["30px", "355px"],
            tablet: ["50px", "407px"],
          }}
          areas={{
            "default": [
              { name: "box", start: [0, 1], end: [0, 1] },
              { name: "", start: [1, 1], end: [1, 1] },
            ],
            tablet: [
              { name: "", start: [0, 1], end: [0, 1] },
              { name: "box", start: [1, 1], end: [1, 1] },
              { name: "", start: [2, 1], end: [2, 1] },
            ],
          }}
        >
          <GridItem area="box">
            <RoundedBox width="100%" height="100%" shadow="big">
              {children}
            </RoundedBox>
          </GridItem>
        </HeaderOverlay>
      }
    >
      <HeaderContent
        areas={{
          "default": [
            { name: "", start: [0, 0], end: [0, 0] },
            { name: "image", start: [2, 0], end: [2, 0] },
          ],
          tablet: [
            { name: "image", start: [0, 0], end: [0, 0] },
            { name: "", start: [2, 0], end: [2, 0] },
          ],
        }}
      >
        <GridItem area="image">
          <AmbassadorOnLogo
            size={"lg"}
            imageSrc={ambassadorImg}
            themeColor={logoColor}
          />
        </GridItem>
      </HeaderContent>
    </Header>
  )
);
