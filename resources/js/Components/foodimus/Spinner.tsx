/**
 * An animated Foodimus logo, used to indicate a "waiting" status
 */

import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";
import { ThemeColor } from "@/Theme";
import React from "react";
import styled from "styled-components";

const StyledSvg = styled.svg.withConfig(hidePropsFromHtml("color"))<{
  color?: ThemeColor;
}>`
  ${({ color, theme }) => color && `color: ${theme.colors[color]};`}
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }

    75% {
      transform: rotate(360deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  .rotate {
    transform-origin: 50% 50%;
    animation: rotate 3s ease 0.5s infinite normal running;
  }

  .rotate-1 {
    animation-delay: 0.3s;
  }

  .rotate-2 {
    animation-delay: 0.15s;
  }

  .rotate-3 {
    animation-delay: 0s;
  }
`;

type Props = React.ComponentProps<typeof StyledSvg>;
export const Spinner = (p: Props) => (
  <StyledSvg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 36.4 36.4"
    fill="currentColor"
    {...p}
  >
    <path d="M18.206 10.808a7.422 7.422 0 107.422 7.422 7.419 7.419 0 00-7.422-7.422zm0 11.98a4.558 4.558 0 114.558-4.558 4.571 4.571 0 01-4.558 4.558z" />
    <path
      className="rotate rotate-1"
      d="M8.865 4.965l2.706-1.563 2.816 4.878-2.706 1.562z"
    />
    <path className="rotate rotate-2" d="M16.643 0h3.125v7.683h-3.125z" />
    <path
      className="rotate rotate-3"
      d="M24.838 3.402l2.706 1.563-2.816 4.877-2.706-1.563z"
    />
  </StyledSvg>
);

export default Spinner;
