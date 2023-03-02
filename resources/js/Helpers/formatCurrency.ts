import { TFunction } from "react-i18next";

/**
 * Formats a number according to the site locale settings
 * @param t the `t`-function returned from a useTranslation hook
 * @param number the number to format
 * @param params any further parameters to pass to the formatter
 * @returns the formatted number
 */
export const formatCurrency = (
  t: TFunction,
  {
    currency,
    amount,
  }: {
    currency: string;
    amount: number;
  }
) => {
  const locale = t("common:datetime.locale");
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
};

export default formatCurrency;
