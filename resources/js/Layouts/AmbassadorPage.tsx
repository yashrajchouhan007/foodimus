import React from "react";
import { AmbassadorHeader } from "@/Partials/Headers";
import FallbackAvatar from "@img/fallback-avatar.png";
import Foodimus from "@/Layouts/FoodimusPage";
import { Auth } from "@/Types/page-data";
import { ThemeColor } from "@/Theme";
import Markdown from "@/Components/foodimus/Markdown";
import styled from "styled-components";
import { definition as faCheckCircle } from "@fortawesome/free-solid-svg-icons/faCheckCircle";

import Fill from "@/Components/foodimus/Fill";
import Button from "@/Components/foodimus/Button";
import { Inertia } from "@inertiajs/inertia";
import useRoute from "@/Hooks/useRoute";
import breakpoints from "@/Theme/breakpoints";
import { useTablet } from "@/Hooks/useMedia";
import svgCssIcon from "@/Helpers/svgCssIcon";
import ErrorBoundary from "@/Components/foodimus/ErrorBoundary";
import { FlashProps } from "@/Partials/Flash";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100%;
  padding: 20px 25px;
  @media ${breakpoints.tablet} {
    padding: 25px 30px;
  }
`;
const StyledBoxText = styled(Markdown).attrs({
  unstyled: ["ul", "li"],
})`
  font-size: 12px;
  line-height: 14px;
  ul,
  ol {
    font-size: 14px;
    line-height: 15px;
  }
  li {
    margin-top: 1em;
  }
  @media ${breakpoints.tablet} {
    font-size: 14px;
    line-height: 16px;
    ul,
    ol {
      font-size: 16px;
    }
    li {
      margin-top: 1em;
    }
  }
  ul,
  ol {
    margin-left: 2.5em;
  }
  ul li:before {
    content: "";
    background: ${({ theme }) =>
      svgCssIcon(faCheckCircle, theme.colors.purple)};
    background-repeat: no-repeat;
    display: inline-block;
    margin-left: -2.5em;
    min-width: 2.5em;
    height: 20px;
    position: relative;
    top: 4px;
  }
`;
export type HeaderBoxContent = {
  textMobile: string;
  textDesktop?: string;
  buttonText: string;
  buttonTarget: string;
  buttonTargetParams: { [s: string]: string };
  buttonColor?: ThemeColor;
};
export type PageData = {
  auth: Auth;
  backgroundColor?: ThemeColor;
  logoColor?: ThemeColor;
  ambassadorImg?: string;
  headerBoxContent?: HeaderBoxContent;
  flash: FlashProps | null;
};
type Props = PageData & {
  modal?: React.ReactNode;
  children?: React.ReactNode;
};

export const AmbassadorPage = ({
  modal,
  children,
  backgroundColor,
  logoColor,
  ambassadorImg,
  auth,
  headerBoxContent,
  flash,
}: Props) => {
  const { route } = useRoute();
  const text =
    (useTablet() && headerBoxContent?.textDesktop) ||
    headerBoxContent?.textMobile;
  return (
    <Foodimus
      header={
        <AmbassadorHeader
          auth={auth}
          backgroundColor={backgroundColor || "pink"}
          logoColor={logoColor || "purple"}
          ambassadorImg={ambassadorImg}
        >
          <StyledContainer>
            <StyledBoxText>{text || ""}</StyledBoxText>
            <Fill />
            {headerBoxContent?.buttonTarget &&
              headerBoxContent?.buttonTargetParams &&
              headerBoxContent?.buttonText && (
                <Button
                  onClick={() => {
                    Inertia.get(
                      route(
                        headerBoxContent?.buttonTarget,
                        headerBoxContent?.buttonTargetParams
                      )
                    );
                  }}
                  color={headerBoxContent?.buttonColor || "green"}
                >
                  {headerBoxContent?.buttonText}
                </Button>
              )}
          </StyledContainer>
        </AmbassadorHeader>
      }
      flash={flash}
      modal={modal}
    >
      {children}
    </Foodimus>
  );
};
export default AmbassadorPage;
