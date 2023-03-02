import React from "react";
import { useTranslation } from "react-i18next";
import { H1 } from "@/Components/foodimus/typography/Headings";
import OptionalAuthPage from "@/Layouts/OptionalAuthPage";
import Markdown from "@/Components/foodimus/Markdown";
import breakpoints from "@/Theme/breakpoints";
import headerContentWidth from "@/Theme/headerContentWidth";
import styled from "styled-components";

const PageContent = styled.div`
  ${headerContentWidth};
  display: flex;
  flex-direction: column;
  padding: 30px 0;
  gap: 50px;
  @media ${breakpoints.tablet} {
    padding: 50px 0;
  }
`;
type Props = React.ComponentProps<typeof OptionalAuthPage> & {
  content?: string;
};

export const TermsPage = ({ content, ...p }: Props) => {
  const { t } = useTranslation("terms");
  return (
    <OptionalAuthPage {...p}>
      <PageContent>
        <Markdown linkAsAnchor>{content || ""}</Markdown>
      </PageContent>
    </OptionalAuthPage>
  );
};

export default TermsPage;
