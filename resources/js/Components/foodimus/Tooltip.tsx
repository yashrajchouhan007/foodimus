/**
 * A container that will show a popup on mouse hover. The popup will be placed according to the
 * size and scroll status of the viewport
 */

import React, { useRef, useState } from "react";
import styled from "styled-components";

const TooltipContent = styled.div`
  box-shadow: -1px 0px 6px #00000027;
  border-radius: 5px;
`;
const TooltipPlaceholder = styled.div``;
type TooltipSide = "top" | "bottom";
const StyledContainer = styled.div<{
  side: TooltipSide;
  arrow: number;
  width: number;
}>`
  display: inline-block;
  position: relative;

  > ${TooltipContent} {
    transition: opacity linear 150ms;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    z-index: 10;
    width: ${({ width }) => width}px;
    max-width: calc(100vw - 20px);
    padding: 10px;
    background-color: ${({ theme }) => theme.colors.purple};
    color: ${({ theme }) => theme.colors.white};

    ${({ side }) =>
      side === "top"
        ? `
    top: 100%;
    margin-top: 10px;
    `
        : `
    bottom: 100%;
    margin-bottom: 10px;
    `}
    ${({ arrow }) =>
      arrow > 0
        ? `
    left: 50%;
    margin-left: -${arrow}px;
    `
        : `
    right: 50%;
    margin-right: ${arrow}px;
    `}

    &:before {
      content: "";
      display: block;
      position: absolute;
      background-color: inherit;
      width: 100px;
      height: 100px;
      z-index: -1;

      ${({ side }) =>
        side === "top"
          ? `
          top: -50px;
        `
          : `
          bottom: -50px;
        `}
      ${({ arrow }) =>
        arrow > 0
          ? `
          left: -50px;
          transform: translate(${arrow}px, 0) rotate(45deg) scale(0.25);
        `
          : `
          right: 50px;
          transform: translate(${arrow}px, 0) rotate(45deg) scale(0.25);
        `}
    }
  }
  > ${TooltipPlaceholder} {
  }
  :hover > ${TooltipContent} {
    opacity: 1;
    pointer-events: initial;
  }
`;

type Props = {
  contents: React.ReactNode;
  children: React.ReactNode;
  width?: number;
};
export const Tooltip = ({ contents, children, width }: Props) => {
  const container = useRef<HTMLDivElement | null>(null);
  const tooltip = useRef<HTMLDivElement | null>(null);
  const [side, setSide] = useState<TooltipSide>("top");
  const [arrow, setArrow] = useState<number>(50);
  if (width === undefined) width = 300;

  return (
    <StyledContainer
      ref={container}
      arrow={arrow}
      onMouseOver={(e) => {
        e.preventDefault();
        if (!container.current || !tooltip.current) return;
        const cnt = container.current;
        const ttp = tooltip.current;

        const spacing = { x: 10, y: 40 };
        const margin = 10;

        const {
          width: cw,
          height: ch,
          x: cx,
          y: cy,
        } = cnt.getBoundingClientRect();
        const { width: tw, height: th } = ttp.getBoundingClientRect();

        const vw = document.documentElement.clientWidth;
        const vh = document.documentElement.clientHeight;

        const newSide =
          cy + ch + th + margin + spacing.y < vh ? "top" : "bottom";
        if (newSide !== side) setSide(newSide as TooltipSide);

        let newArrow = 50;
        const spaceLeftX = vw - spacing.x - (cx + cw / 2 + tw - newArrow);
        if (spaceLeftX < 0) newArrow -= spaceLeftX;
        if (newArrow != arrow) setArrow(newArrow);
      }}
      width={width}
      side={side}
    >
      <TooltipContent ref={tooltip}>{contents}</TooltipContent>
      <TooltipPlaceholder>{children}</TooltipPlaceholder>
    </StyledContainer>
  );
};

export default Tooltip;
