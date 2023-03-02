import React from "react";
import { PageHeader } from "@/Partials/Headers";
import FallbackAvatar from "@img/fallback-avatar.png";
import Page from "@/Layouts/FoodimusPage";
import { Image, Auth } from "@/Types/page-data";
import ErrorBoundary from "@/Components/foodimus/ErrorBoundary";
import { FlashProps } from "@/Partials/Flash";

export type SearchData = {
  auth: Auth;
  heroImg?: Image;
};
type Props = SearchData & {
  modal?: React.ReactNode;
  children?: React.ReactNode;
  title: React.ReactNode;
  subtitle: React.ReactNode;
  flash: FlashProps | null;
};

export const PictureHeaderPage = ({
  modal,
  heroImg,
  children,
  title,
  subtitle,
  flash,
  auth,
  ...p
}: Props) => {
  return (
    <Page
      header={
        <PageHeader
          auth={auth}
          backgroundImg={heroImg?.src}
          backgroundFocus={heroImg?.focus}
          title={title}
          subtitle={subtitle}
        />
      }
      flash={flash}
      modal={modal}
    >
      <ErrorBoundary>{children}</ErrorBoundary>
    </Page>
  );
};

export default PictureHeaderPage;
