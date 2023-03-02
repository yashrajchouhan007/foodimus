import React from "react";
import styled from "styled-components";
import Separator from "./Separator";
import { H3 } from "./typography/Headings";
import breakpoints from "@/Theme/breakpoints";
import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";

const Subtitle = styled.div`
  font-family: ${({ theme }) => theme.fonts.control};
  font-size: 13px;
`;
const TipText = styled.p`
  :before {
    content: "“";
  }
  :after {
    content: "”";
  }
`;

const TipContentBase = styled.div.withConfig(hidePropsFromHtml("orientation"))<{
  orientation: "auto" | "vertical";
}>`
  display: flex;
  gap: 5px;
  .header {
    padding-right: 20px;
  }
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  flex-direction: column;
  ${({ orientation }) =>
    orientation === "vertical" &&
    `

  @media ${breakpoints.tablet}{
      gap: 10px;
      padding: 15px 35px 15px 15px;
      .content{
          gap:30px;
      }
  }
`}
  ${({ orientation }) =>
    orientation === "auto" &&
    `
  @media ${breakpoints.tablet}{
      flex-direction:row;
      gap: 30px;
      .header,
      .content {
      padding: 20px;
      }
  }
`}
`;

type TipContentProps = {
  ambassadorName?: string;
  ambassadorTitle?: string;
  text: React.ReactNode;
  button?: React.ReactNode;
  orientation?: "auto" | "vertical";
};
export const TipContent = ({
  ambassadorName,
  ambassadorTitle,
  text,
  button,
  orientation,
}: TipContentProps) => (
  <TipContentBase orientation={orientation || "auto"}>
    <div className="header">
      <H3>{ambassadorName}</H3>
      <Subtitle>{ambassadorTitle}</Subtitle>
    </div>
    <Separator unsized color="whiteA30" />
    <div className="content">
      <TipText>{text}</TipText>
      {button}
    </div>
  </TipContentBase>
);

export default TipContent;
