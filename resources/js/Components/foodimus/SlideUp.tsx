/**
 * A container that slides in its content
 */
import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import styled from "styled-components";

const StyledContainer = styled.div.withConfig(
  hidePropsFromHtml("open", "contentHeight")
)<{
  open: boolean;
  contentHeight: number;
}>`
  width: 100%;
  ${({ contentHeight, open }) =>
    open ? contentHeight && `height: ${contentHeight}px` : "height: 0px"};
  overflow: hidden;
  transition: all 200ms ease-in-out;
`;
const StyledInnerContainer = styled.div`
  width: 100%;
`;

type Props = React.ComponentProps<typeof StyledContainer> & {
  open: boolean;
};

export const SlideUp = ({ open, children, ...p }: Props) => {
  const innerContainer = useRef<HTMLDivElement | null>(null);
  const [contentHeight, setContentHeight] = useState(null as number | null);
  useEffect(() => {
    const resizeHandler = () => {
      if (innerContainer.current?.offsetHeight === undefined)
        setContentHeight(null);
      else setContentHeight(innerContainer.current.offsetHeight);
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [innerContainer.current]);

  return (
    <StyledContainer {...p} open={open} contentHeight={contentHeight}>
      <StyledInnerContainer className="inner" ref={innerContainer}>
        {children}
      </StyledInnerContainer>
    </StyledContainer>
  );
};

export default SlideUp;
