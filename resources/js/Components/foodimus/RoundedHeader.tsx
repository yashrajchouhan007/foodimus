import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";
import responsive, { isResponsive, Responsive } from "@/Helpers/responsive";
import React, { useRef } from "react";
import styled from "styled-components";
import { v1 as uuidv1 } from "uuid";

const StyledContainer = styled.div.withConfig<{
  paths: string;
}>(hidePropsFromHtml("paths"))`
  ${({ onClick }) => !!onClick && `cursor: pointer;`}
  overflow: auto;
  ${(props) => props.paths}
`;

const toCss = (uuid: string, breakpoint: string, _value?: number) => {
  return `clip-path: url(#${uuid}-${breakpoint});`;
};

type Props = {
  cornerY?: number | Responsive<number>;
  side?: "bottom" | "left";
} & React.ComponentProps<typeof StyledContainer>;

export const RoundedHeader = (p: Props) => {
  const ref = useRef<string>(uuidv1());
  const responsiveCornerY: Responsive<number> = isResponsive(p.cornerY)
    ? p.cornerY
    : { "default": p.cornerY || 0.825 };

  const css = responsive(responsiveCornerY, (o, b) => toCss(ref.current, b, o));

  const dir = 0.77;

  return (
    <>
      <StyledContainer {...p} paths={css} />
      <svg style={{ position: "absolute" }} width={0} height={0}>
        <defs>
          {Object.entries(responsiveCornerY).map(
            ([breakpoint, cornerY]) =>
              cornerY && (
                <clipPath
                  key={`${cornerY}`}
                  id={`${ref.current}-${breakpoint}`}
                  clipPathUnits="objectBoundingBox"
                >
                  <path
                    transform={`rotate(${
                      p.side === "left" ? "90" : "0"
                    }, 0.5, 0.5)`}
                    d={`M0,0 1,0 1,${cornerY} C 1,${cornerY}, ${dir},1, 0.5,1 ${
                      1 - dir
                    },1, 0,${cornerY},0,${cornerY}z`}
                  />
                </clipPath>
              )
          )}
        </defs>
      </svg>
    </>
  );
};

export default RoundedHeader;
