/**
 * A flash card
 */

import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";
import breakpoints from "@/Theme/breakpoints";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import styled, { css } from "styled-components";
import RoundedBox from "./RoundedBox";
import SlideUp from "./SlideUp";

const floatFlash = css`
  position: fixed;
  z-index: 20;
  top: 10px;
  bottom: auto;
  right: 10px;
  left: 10px;
  @media ${breakpoints.tablet} {
    top: auto;
    bottom: 10px;
    right: 10px;
    left: auto;
    width: 300px;
  }
`;

const FlashFloat = styled.div.withConfig(hidePropsFromHtml("float"))<{
  float: boolean;
}>`
  ${({ float }) => float && floatFlash}
`;

export const FlashContent = styled(RoundedBox).withConfig(hideProps("type"))<{
  type?: "message" | "error" | "success";
}>`
  padding: 20px;
  font-family: ${({ theme }) => theme.fonts.control};
  background-color: ${({ type, theme }) =>
    ({
      message: theme.colors.purple,
      error: theme.colors.red,
      success: theme.colors.green,
    }[type || "message"])};
  color: ${({ theme }) => theme.colors.white};
`;

type Props = {
  children: React.ReactNode;
  timeMs?: number;
  open?: boolean;
  flashId?: string;
} & Omit<React.ComponentProps<typeof SlideUp>, "open">;
export const Flash = ({
  timeMs,
  open: userOpen,
  children,
  flashId,
  ...p
}: Props) => {
  const time = timeMs || 4000;
  const ref = useRef(null as null | HTMLDivElement);
  const [open, setOpen] = useState(false);
  const [float, setFloat] = useState(false);
  const timer = useRef<number>();
  useEffect(() => {
    const box = ref.current?.getBoundingClientRect();
    const { clientWidth: cw, clientHeight: ch } = document.documentElement;
    if (box) {
      const newFloat =
        box.bottom < 0 || box.top > ch || box.right < 0 || box.left > cw;
      if (newFloat != float) setFloat(newFloat);
    }
    window.setTimeout(() => setOpen(true), 0);
    if (time !== 0)
      timer.current = window.setTimeout(() => setOpen(false), time);
    return () => {
      window.clearTimeout(timer.current);
    };
  }, [time, flashId]);

  return (
    <div ref={ref}>
      <FlashFloat float={float}>
        <SlideUp {...p} open={userOpen || open}>
          {children}
        </SlideUp>
      </FlashFloat>
    </div>
  );
};
export default Flash;
