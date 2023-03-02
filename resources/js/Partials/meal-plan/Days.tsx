import Separator from "@/Components/foodimus/Separator";
import React, { useState } from "react";
import styled from "styled-components";
import Day, { DayData } from "./Day";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;
export type DaysData = {
  days: DayData[];
};
type Props = DaysData;
export const Days = ({ days }: Props) => {
  const [openDay, setOpenDay] = useState(0 as number | null);
  return (
    <StyledContainer>
      {days.map((i, ix) => (
        <React.Fragment key={ix}>
          <Separator />
          <Day
            open={openDay === ix}
            onToggle={() => setOpenDay(openDay === ix ? null : ix)}
            {...i}
          />
        </React.Fragment>
      ))}
      <Separator />
    </StyledContainer>
  );
};

export default Days;
