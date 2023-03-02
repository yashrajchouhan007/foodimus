import { GuestHeader, SmallHeader } from "@/Partials/Headers";
import React from "react";
import Foodimus from "./FoodimusPage";
import FallbackAvatar from "@img/fallback-avatar.png";
import { Auth } from "@/Types/page-data";
import ErrorBoundary from "@/Components/foodimus/ErrorBoundary";
import Flash, { FlashProps } from "@/Partials/Flash";
import styled from "styled-components";
import headerContentWidth from "@/Theme/headerContentWidth";
import breakpoints from "@/Theme/breakpoints";

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

type Props = {
  modal?: React.ReactNode;
  children?: React.ReactNode;
  flash: FlashProps | null;
  footer?: boolean;
};
export const GuestPage = ({ modal, children, flash, footer }: Props) => (
  <Foodimus
    header={<GuestHeader />}
    flash={flash}
    modal={modal}
    footer={footer}
  >
    {children}
  </Foodimus>
);

export default GuestPage;
