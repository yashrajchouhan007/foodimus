import { DateTime } from "luxon";
import { TFunction } from "react-i18next";

/**
 * Formats a date according to the site locale settings
 * @param t the `t`-function returned from a useTranslation hook
 * @param date the date to format
 * @param params any further parameters to pass to the formatter
 * @returns the formatted date
 */
export const formatDate = (
  t: TFunction,
  date: DateTime,
  params: Intl.DateTimeFormatOptions
) => {
  const locale = t("common:datetime.locale");
  return date.setLocale(locale).toLocaleString(params);
};
export default formatDate;

/**
 * Formats a date as a string representation relative to the current day,
 * according to the site locale settings
 * @param t the `t`-function returned from a useTranslation hook
 * @param date the date to format
 * @returns the formatted date
 */
export const formatRelative = (t: TFunction, date: DateTime) => {
  const locale = t("common:datetime.locale");
  return date.setLocale(locale).toRelativeCalendar();
};
