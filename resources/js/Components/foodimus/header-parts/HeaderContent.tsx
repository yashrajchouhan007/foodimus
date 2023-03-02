/**
 * This is the container for the header logo, menu and user avatar
 */

import headerContentWidth from "@/Theme/headerContentWidth";
import React from "react";
import styled from "styled-components";
import Grid from "../Grid";

type Props = React.ComponentProps<typeof Grid>;
export default styled(Grid).attrs((p: Props) => ({
  cols: p.cols || ["auto", 1, "auto"],
  areas: p.areas || [
    { name: "left", start: [0, 0], end: [0, 0] },
    { name: "right", start: [2, 0], end: [2, 0] },
  ],
}))`
  ${headerContentWidth}
  height: 100%;
`;
