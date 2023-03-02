/**
 * A small, purple, round button, used for links to social media
 */
import breakpoints from "@/Theme/breakpoints";
import styled from "styled-components";

export default styled.button`
  display: inline-flex;
  color: ${({ theme }) => theme.colors.white};
  align-items: center;
  justify-content: center;
  user-select: none;
  border-radius: 999px;

  width: 38px;
  height: 38px;
  @media ${breakpoints.tablet} {
    width: 27px;
    height: 27px;
  }

  transition: background-color 100ms linear;
  background-color: ${({ theme }) => theme.colors.purple};
  @media (hover: hover) {
    &:hover {
      background-color: ${({ theme }) => theme.colors.purpleL20};
    }
  }
  &:active {
    background-color: ${({ theme }) => theme.colors.purpleL10};
  }
`;
