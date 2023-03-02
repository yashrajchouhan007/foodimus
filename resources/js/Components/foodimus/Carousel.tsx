/**
 * A draggable carousel component
 */

import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import styled from "styled-components";

const StyledContainer = styled.div.withConfig(
  hidePropsFromHtml("innerHeight", "fadeSize", "fade")
)<{
  innerHeight: number;
  fadeSize: number;
  fade: "none" | "left" | "right" | "both";
}>`
  box-sizing: content-box;
  position: relative;
  width: 100%;
  height: ${({ innerHeight }) => innerHeight}px;
  padding: 10px 0;
  margin-top: -10px;
  overflow: hidden;
  ${(props) =>
    props.fade !== "none" &&
    `
    :before {
      content: "";
      pointer-events: none;
      display: block;
      position: absolute;
      height: 200%;
      top: -50%;
      width: ${props.fade === "both" ? "100%" : "150%"};
      left: ${props.fade === "right" ? "-50%" : "0"};
      box-shadow: inset ${props.theme.colors.background} 0 0
        ${props.fadeSize - 6}px 6px;
      z-index: 10;
    }
  `}
`;
const DragContainer = styled.div.withConfig(
  hidePropsFromHtml("gap", "height")
)<{
  gap: number;
  height: number;
}>`
  --translateX: 0;
  position: absolute;
  width: auto;
  height: ${({ height }) => height}px;
  display: flex;
  gap: ${({ gap }) => gap}px;
  transform: translate(var(--translateX), 0);
  transition: transform var(--transition) var(--easing);
`;

const ItemContainer = styled.div.withConfig(
  hidePropsFromHtml("width", "height")
)<{
  width: number;
  height: number;
}>`
  display: block;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
`;

type Dragging = null | {
  start: number; // the start position of the mouse
  current: number; // the current position of the mouse
  control: number; // the start position of the control
};
interface StoppableEvent {
  preventDefault: () => void;
}
type Props = {
  fade: "none" | "left" | "right" | "both";
  itemWidth: number;
  itemHeight: number;
  gap?: number;
  leftMargin: number;
  showButtons?: boolean;
  children: React.ReactNode[];
  carouselRef?: MutableRefObject<
    | undefined
    | {
        goToNext: () => void;
        goToPrev: () => void;
      }
  >;
} & React.ComponentProps<typeof StyledContainer>;

export const Carousel = ({
  itemWidth,
  itemHeight,
  gap: _gap,
  showButtons: _showButtons,
  children,
  leftMargin,
  carouselRef,
  fade,
  ...p
}: Props) => {
  // The current slide
  const [slide, setSlide] = useState(0);
  // The x offset of the drag container
  const [translateX, setTranslateX] = useState(leftMargin);
  // null if we're not dragging. Otherwise, an object
  const [dragging, setDragging] = useState(null as Dragging);

  const draggingRef = useRef<{
    translateX: number;
    dragging: Dragging;
  }>();
  draggingRef.current = { translateX, dragging };

  const dragTarget = useRef<HTMLDivElement>(null);

  const slides = children.length;
  const gap = _gap || 20;
  const maxSlide = slides - 1;

  useEffect(() => {
    // carouselRef can be used from a different component to navigate the carousel
    if (carouselRef)
      carouselRef.current = {
        goToNext: () => {
          slide < maxSlide && setSlide(slide + 1);
        },
        goToPrev: () => {
          slide > 0 && setSlide(slide - 1);
        },
      };
  }, [setSlide, slide, carouselRef]);

  useEffect(() => {
    if (!dragging) {
      // if not dragging, the position depends on the current slide
      setTranslateX(leftMargin - slide * (itemWidth + gap));
    } else {
      // if dragging, the position depends on the mouse position relative
      // to the start, and the starting position of the control
      setTranslateX(dragging.control + (dragging.current - dragging.start));
    }
  }, [slide, dragging?.current, leftMargin, itemWidth, gap]);

  // Make sure all mouse events are handled correctly
  useEffect(() => {
    const onStartDragging = (_e: StoppableEvent, x: number) => {
      if (draggingRef.current === undefined) return;
      setDragging({
        start: x,
        current: x,
        control: draggingRef.current.translateX,
      });
    };
    const onStopDragging = (_e: StoppableEvent) => {
      if (draggingRef.current === undefined) return;
      setDragging(null);
      // round to the nearest slide
      let slide = Math.round(
        (-draggingRef.current.translateX + leftMargin) / (itemWidth + gap)
      );
      if (slide < 0) slide = 0;
      if (slide > maxSlide) slide = maxSlide;
      setSlide(slide);
    };
    const onMove = (e: StoppableEvent, x: number) => {
      if (!draggingRef.current?.dragging) return;
      e.preventDefault();
      setDragging({ ...draggingRef.current.dragging, current: x });
    };

    // Create all the different handlers
    const elem = dragTarget.current;
    const onMouseDown = (e: MouseEvent) => onStartDragging(e, e.clientX);
    const onMouseMove = (e: MouseEvent) => onMove(e, e.clientX);
    const onMouseOut = (e: MouseEvent) => onStopDragging(e);
    const onMouseUp = (e: MouseEvent) => onStopDragging(e);
    const onTouchStart = (e: TouchEvent) =>
      onStartDragging(e, e.touches[0].clientX);
    const onTouchMove = (e: TouchEvent) => onMove(e, e.touches[0].clientX);
    const onTouchEnd = (e: TouchEvent) => onStopDragging(e);
    const onTouchCancel = (e: TouchEvent) => onStopDragging(e);

    // Attach the handlers
    elem?.addEventListener("mousedown", onMouseDown);
    elem?.addEventListener("mousemove", onMouseMove);
    //elem?.addEventListener("mouseout", onMouseOut);
    elem?.addEventListener("mouseleave", onMouseOut);
    elem?.addEventListener("mouseup", onMouseUp);
    elem?.addEventListener("touchstart", onTouchStart);
    elem?.addEventListener("touchmove", onTouchMove);
    elem?.addEventListener("touchend", onTouchEnd);
    elem?.addEventListener("touchcancel", onTouchCancel);

    return () => {
      // Detach the handlers when unmounting
      elem?.removeEventListener("mousedown", onMouseDown);
      elem?.removeEventListener("mousemove", onMouseMove);
      //elem?.removeEventListener("mouseout", onMouseOut);
      elem?.removeEventListener("mouseleave", onMouseOut);
      elem?.removeEventListener("mouseup", onMouseUp);
      elem?.removeEventListener("touchstart", onTouchStart);
      elem?.removeEventListener("touchmove", onTouchMove);
      elem?.removeEventListener("touchend", onTouchEnd);
      elem?.removeEventListener("touchcancel", onTouchCancel);
    };
  }, [
    dragTarget.current,
    draggingRef,
    setDragging,
    setSlide,
    maxSlide,
    leftMargin,
    itemWidth,
    gap,
  ]);

  return (
    <>
      <StyledContainer
        innerHeight={itemHeight}
        fade={fade}
        fadeSize={leftMargin}
        ref={dragTarget}
        {...p}
      >
        <DragContainer
          style={
            {
              "--translateX": `${translateX}px`,
              "--transition": `${dragging ? 0 : 300}ms`,
              "--easing": `${dragging ? "linear" : "ease-in-out"}`,
            } as React.CSSProperties
          }
          height={itemHeight}
          gap={gap}
        >
          {children.map((i, ix) => (
            <ItemContainer key={ix} height={itemHeight} width={itemWidth}>
              {i}
            </ItemContainer>
          ))}
        </DragContainer>
      </StyledContainer>
    </>
  );
};

export default Carousel;
