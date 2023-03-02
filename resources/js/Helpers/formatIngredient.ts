import { TFunction } from "react-i18next";
import Fraction from "fraction.js";
import formatNumber from "./formatNumber";
import formatFraction from "./formatFraction";

/**
 * Formats a number according to the site locale settings
 * @param t the `t`-function returned from a useTranslation hook
 * @param number the number to format
 * @param params any further parameters to pass to the formatter
 * @returns the formatted number
 */
export const formatIngredient = (
  t: TFunction,
  amount: number,
  unit?: string,
  name?: string
) => {
  return (
    formatFraction(t, amount, {
      maximumSignificantDigits: 2,
      maximumFractionDigits: 2,
    }) +
    (unit ? ` ${unit}` : "") +
    (name ? ` ${name}` : "")
  );
};

export default formatIngredient;
