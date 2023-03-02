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

const StyledContainer = styled.div`
  align-self: center;
  min-height: 100px;
  width: 100%;
  max-width: 900px;
  @media ${breakpoints.tablet} {
    background-color: white;
    box-shadow: 2px 3px 6px #0000000a;
    border-radius: 5px;
    padding: 60px 100px;
  }
`;
type Props = React.ComponentProps<typeof OptionalAuthPage> & {
  status?: number;
};

export const ErrorPage = ({ status, ...p }: Props) => {
  const { t } = useTranslation("error");
  return (
    <OptionalAuthPage {...p}>
      <PageContent>
        <StyledContainer>
          <Markdown>{t(`${status}.content`)}</Markdown>
        </StyledContainer>
      </PageContent>
    </OptionalAuthPage>
  );
};

export default ErrorPage;
