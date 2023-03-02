/**
 * A menu that can be shown underneath the header. Used on the meal pages
 */
import breakpoints from "@/Theme/breakpoints";
import styled from "styled-components";

export default styled.div`
  display: flex;
  background-color: ${(props) => props.theme.colors.background};
  border-radius: 5px;
  padding: 9px 0;
  align-self: stretch;
  font-family: ${(props) => props.theme.fonts.control};
  font-size: 14px;
  margin: 0 18px;
  z-index: 5;

  * {
    flex-grow: 1;
    text-align: center;
  }
  *:not(:last-child) {
    border-right: solid thin ${(props) => props.theme.colors.purpleA30};
  }
  *.active {
    font-family: ${(props) => props.theme.fonts.controlBold};
  }
  @media ${breakpoints.tablet} {
    align-self: center;
    padding: 17px 0;
    font-size: 17px;
    * {
      padding: 0 50px;
    }
  }
`;
