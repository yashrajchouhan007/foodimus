import React from "react";
import Footer from "@/Partials/Footer";
import styled from "styled-components";
import breakpoints from "@/Theme/breakpoints";
import RoundedBox from "@/Components/foodimus/RoundedBox";
import ErrorBoundary from "@/Components/foodimus/ErrorBoundary";
import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";
import Flash, { FlashProps } from "@/Partials/Flash";
import headerContentWidth from "@/Theme/headerContentWidth";

const StyledPage = styled.div`
  display: flex;
  flex-direction: column;
`;
export const StyledModal = styled(RoundedBox).withConfig(
  hideProps("gap", "align")
)<{
  gap?: number;
  align?: "left" | "center" | "stretch";
}>`
  padding: 20px;
  margin: 20px;
  min-height: 300px;
  @media ${breakpoints.tablet} {
    width: 500px;
  }

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  align-items: ${({ align }) =>
    align === "center"
      ? "center"
      : align === "stretch"
      ? "stretch"
      : "flex-start"};
  gap: ${({ gap }) => gap || 0}px;
`;
const StyledModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.backgroundA60};
  z-index: 999;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;

  @media ${breakpoints.tablet} {
    justify-content: center;
    align-items: center;
  }
`;

const StyledFlash = styled(Flash)`
  width: auto;
  ${headerContentWidth}
  .inner {
    padding-top: 30px;
    @media ${breakpoints.tablet} {
      padding-top: 50px;
    }
  }
`;

export type PageProps = React.ComponentProps<typeof StyledPage> & {
  modal: React.ReactNode | null;
  footer?: boolean;
  flash: FlashProps | null;
  header: React.ReactNode;
};
export const FoodimusPage = ({
  modal,
  children,
  footer,
  flash,
  header,
  ...p
}: PageProps) => (
  <StyledPage {...p}>
    <ErrorBoundary>
      {!!modal && <StyledModalContainer>{modal}</StyledModalContainer>}
    </ErrorBoundary>
    <ErrorBoundary>{header}</ErrorBoundary>
    <ErrorBoundary>{flash && <StyledFlash {...flash} />}</ErrorBoundary>
    <ErrorBoundary>{children}</ErrorBoundary>
    <ErrorBoundary>{footer !== false && <Footer />}</ErrorBoundary>
  </StyledPage>
);

export default FoodimusPage;
