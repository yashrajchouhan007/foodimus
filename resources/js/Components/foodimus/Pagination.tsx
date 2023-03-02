import React from "react";
import styled from "styled-components";
import { definition as faChevronLeft } from "@fortawesome/free-solid-svg-icons/faChevronLeft";
import { definition as faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";
import { definition as faEllipsisH } from "@fortawesome/free-solid-svg-icons/faEllipsisH";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";
const StyledButton = styled.button.withConfig(hidePropsFromHtml("current"))<{
  current?: boolean;
}>`
  font-family: ${({ theme, current }) =>
    current ? theme.fonts.sans : theme.fonts.sansBold};
  color: ${({ theme, current }) => (current ? theme.colors.purple : "inherit")};
  width: 18px;
  text-align: center;
`;

const StyledContainer = styled.span`
  display: flex;
  gap: 12px;
  font-size: 16px;
`;

const listPageButtons = (pages: number, current: number) => {
  const showPageButtons = [] as number[];
  const showPages = pages > 7 ? 7 : pages;
  showPageButtons.push(current);
  for (let i = 1; showPageButtons.length < showPages; i++) {
    current - i >= 0 && showPageButtons.push(current - i);
    current + i < pages && showPageButtons.push(current + i);
  }
  showPageButtons.sort((a, b) => a - b);

  let dotsFront = false;
  let dotsRear = false;
  if (showPageButtons[0] != 0) {
    dotsFront = true;
    showPageButtons.splice(0, 1);
  }
  const lastIx = showPageButtons.length - 1;
  if (showPageButtons[lastIx] != pages - 1) {
    dotsRear = true;
    showPageButtons.splice(lastIx, 1);
  }
  return { dotsFront, dotsRear, showPageButtons };
};

type Props = {
  pages: number;
  current: number;
  onPageSelected?: (page: number) => void;
};

export const Pagination = ({ pages, current, onPageSelected }: Props) => {
  if (current >= pages) {
    current = pages - 1;
  } else if (current < 0) {
    current = 0;
  }
  const { dotsFront, dotsRear, showPageButtons } = listPageButtons(
    pages,
    current
  );
  const stepForward = showPageButtons[showPageButtons.length - 1] + 3;
  const stepBackward = showPageButtons[0] - 3;
  return (
    <StyledContainer>
      {/* the leftward arrow */}
      <StyledButton
        onClick={() => onPageSelected?.(current - 1)}
        disabled={current === 0}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </StyledButton>
      {/* the dots to the left side */}
      {dotsFront && (
        <StyledButton
          onClick={() => onPageSelected?.(Math.max(0, stepBackward))}
        >
          <FontAwesomeIcon icon={faEllipsisH} />
        </StyledButton>
      )}
      {/* the actual pages */}
      {showPageButtons.map((p) => (
        <StyledButton
          key={p}
          current={p === current}
          onClick={() => onPageSelected?.(p)}
        >
          {p + 1}
        </StyledButton>
      ))}
      {/* the dots to the right side */}
      {dotsRear && (
        <StyledButton
          onClick={() => onPageSelected?.(Math.min(pages - 1, stepForward))}
        >
          <FontAwesomeIcon icon={faEllipsisH} />
        </StyledButton>
      )}
      {/* the rightward button */}
      <StyledButton
        onClick={() => onPageSelected?.(current + 1)}
        disabled={current === pages - 1}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </StyledButton>
    </StyledContainer>
  );
};

export default Pagination;
