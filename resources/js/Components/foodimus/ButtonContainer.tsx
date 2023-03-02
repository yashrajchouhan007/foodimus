/**
 * A container to show multiple buttons on a modal or in a box
 */
import breakpoints from "@/Theme/breakpoints";
import styled from "styled-components";

export default styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: flex-start;
  @media ${breakpoints.tablet} {
    flex-direction: row;
  }
`;
