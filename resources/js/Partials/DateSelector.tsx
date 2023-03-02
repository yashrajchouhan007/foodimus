import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import Directional, {
  DirectionalButton,
} from "@/Components/foodimus/Directional";
import { definition as faCalendarAlt } from "@fortawesome/free-regular-svg-icons/faCalendarAlt";

import PopupMenu from "@/Components/foodimus/PopupMenu";
import Calendar from "@/Components/foodimus/Calendar";
import { DateTime } from "luxon";

const StyledPopupMenu = styled(PopupMenu).attrs(() => ({ nostyle: true }))`
  width: 100%;
  * {
    margin-left: auto;
    margin-right: auto;
  }
`;
type Props = {
  minDate: DateTime;
  maxDate: DateTime;
  value: DateTime;
  onChange: (value: DateTime) => void;
};
export const DateSelector = ({ minDate, maxDate, value, onChange }: Props) => {
  const { t } = useTranslation("meals");
  const [showCalendar, setShowCalendar] = useState(false);

  const dayCount = maxDate.diff(minDate, "days").days + 1;
  const activeDayCount = value.diff(minDate, "days").days + 1;

  return (
    <div>
      <StyledPopupMenu show={showCalendar}>
        <Calendar
          minDate={minDate.toJSDate()}
          maxDate={maxDate.toJSDate()}
          value={value.toJSDate()}
          title={t("dev:calendar.title")}
          onClose={() => {
            setShowCalendar(false);
          }}
          onChange={(date: Date) => {
            onChange(DateTime.fromJSDate(date));
          }}
        />
      </StyledPopupMenu>
      <Directional
        onClickLeft={() => {
          if (activeDayCount <= 1) return;
          onChange(value.minus({ days: 1 }));
        }}
        onClickRight={() => {
          if (activeDayCount >= dayCount) return;
          onChange(value.plus({ days: 1 }));
        }}
      >
        <DirectionalButton
          onClick={() => {
            setShowCalendar(!showCalendar);
          }}
          color="blue"
        >
          {faCalendarAlt}
        </DirectionalButton>
      </Directional>
    </div>
  );
};

export default DateSelector;
