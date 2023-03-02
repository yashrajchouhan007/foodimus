import { TFunction } from "react-i18next";
import Fraction from "fraction.js";
import formatNumber from "./formatNumber";

/**
 * Formats a number according to the site locale settings
 * @param t the `t`-function returned from a useTranslation hook
 * @param number the number to format
 * @param params any further parameters to pass to the formatter
 * @returns the formatted number
 */
export const formatFraction = (
  t: TFunction,
  number: number,
  params?: Intl.NumberFormatOptions
) => {
  const int = Math.floor(number);
  const dec = number - int;
  const fraction = new Fraction(dec);
  if (![1, 2, 3, 4, 6, 7, 8].includes(fraction.n) || int > 40)
    return formatNumber(t, number, params);
  if (int !== 0)
    return `${int} ${fraction.toFraction(true).replace("/", "\u2044")}`;
  return fraction.toFraction(true).replace("/", "\u2044");
};

export default formatFraction;
