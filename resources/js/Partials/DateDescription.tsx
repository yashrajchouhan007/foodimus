import formatDate from "@/Helpers/formatDate";
import { DateTime } from "luxon";
import React from "react";
import { useTranslation } from "react-i18next";

type Props = { startDate: DateTime; endDate: DateTime; activeDate: DateTime };
export const DateDescription = ({ startDate, endDate, activeDate }: Props) => {
  const { t } = useTranslation();
  const dayCount = Math.floor(endDate.diff(startDate, "days").days) + 1;
  const activeDayCount =
    Math.floor(activeDate.diff(startDate, "days").days) + 1;

  return (
    <>
      <span className="day">
        {t("date-description", { current: activeDayCount, total: dayCount })}
      </span>{" "}
      <span className="date">
        {formatDate(t, activeDate, {
          weekday: "long",
          month: "long",
          day: "2-digit",
        })}
      </span>
    </>
  );
};

export default DateDescription;
