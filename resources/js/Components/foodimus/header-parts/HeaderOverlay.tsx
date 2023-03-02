/**
 * This component is meant to pass to the `overlay` prop of the Header component,
 * to display something on top of the header background
 */

import styled from "styled-components";
import breakpoints from "@/Theme/breakpoints";
import Grid from "../Grid";

export default styled(Grid)`
  position: absolute;
  z-index: 4;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0 20px;

  top: 144px;
  @media ${breakpoints.tablet} {
    top: 81px;
  }
`;
