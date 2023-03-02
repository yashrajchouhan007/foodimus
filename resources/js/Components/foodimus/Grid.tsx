import styled from "styled-components";
import responsive, { Responsive } from "@/Helpers/responsive";
import getSize, { Size } from "@/Helpers/size";
import getGridSizes, { GridSize } from "@/Helpers/gridSize";
import getGridAreas, { GridAreas } from "@/Helpers/gridAreas";
import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";

/**
 * An item in the grid
 */
export const GridItem = styled.div.withConfig(
  hidePropsFromHtml("area", "dir", "gap")
)<{
  area?: string;
  dir?: "horizontal" | "vertical";
  gap?: Size;
  wrap?: boolean;
}>`
  grid-area: ${(props) => props.area};
  display: flex;
  ${({ dir }) => dir === "vertical" && "flex-direction: column;"}
  ${({ gap }) => !!gap && `${getSize("gap", gap)}`}
  ${({ wrap }) => !!wrap && `flex-wrap: wrap;`}
  position: relative;
`;

/**
 * A responsive grid
 */
export default styled.div.withConfig(
  hidePropsFromHtml("cols", "rows", "gap", "areas")
)<{
  cols?: GridSize | Responsive<GridSize>;
  rows?: GridSize | Responsive<GridSize>;
  gap?: Size | Responsive<Size>;
  areas?: GridAreas | Responsive<GridAreas>;
}>`
  display: grid;
  ${(param) =>
    responsive(param.rows, (o) => getGridSizes("grid-template-rows", o))};
  ${(param) =>
    responsive(param.cols, (o) => getGridSizes("grid-template-columns", o))};
  ${(param) => responsive(param.gap, (o) => getSize("gap", o))};
  ${(param) =>
    responsive(param.areas, (o) => getGridAreas("grid-template-areas", o))};
`;
