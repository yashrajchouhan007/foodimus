import React from "react";
import { MealPlanHeader } from "@/Partials/Headers";
import FallbackAvatar from "@img/fallback-avatar.png";
import Page from "@/Layouts/FoodimusPage";
import { Auth } from "@/Types/page-data";
import { ThemeColor } from "@/Theme";
import ErrorBoundary from "@/Components/foodimus/ErrorBoundary";
import { FlashProps } from "@/Partials/Flash";

export type PageData = {
  auth: Auth;
  backgroundImg?: string;
  backgroundFocus?: [number, number];
  avatarSrc?: string;
  avatarFlip?: boolean;
  avatarColor?: ThemeColor;
  title: React.ReactNode;
  subtitle: React.ReactNode;
};
type Props = PageData & {
  modal?: React.ReactNode;
  children?: React.ReactNode;
  button?: React.ReactNode;
  onClickAvatar?: () => void;
  onClickTitle?: () => void;
  onClickSubtitle?: () => void;
  flash: FlashProps | null;
};

export const MealPlanPage = ({
  modal,
  children,
  backgroundImg,
  backgroundFocus,
  auth,
  avatarSrc,
  avatarFlip,
  title,
  subtitle,
  avatarColor,
  button,
  flash,
  onClickAvatar,
  onClickTitle,
  onClickSubtitle,
}: Props) => {
  return (
    <Page
      header={
        <MealPlanHeader
          auth={auth}
          backgroundImg={backgroundImg}
          backgroundColor="purple"
          backgroundFocus={backgroundFocus}
          avatarColor={avatarColor || "yellow"}
          ambassadorAvatar={avatarSrc || FallbackAvatar}
          ambassadorAvatarFlip={avatarFlip}
          title={title}
          subtitle={subtitle}
          button={button}
          onClickAvatar={onClickAvatar}
          onClickTitle={onClickTitle}
          onClickSubtitle={onClickSubtitle}
        />
      }
      flash={flash}
      modal={modal}
    >
      {children}
    </Page>
  );
};

export default MealPlanPage;
