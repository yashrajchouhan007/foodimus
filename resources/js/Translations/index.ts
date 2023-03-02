import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import countries from "i18n-iso-countries";

// TODO: can we do this in a nicer way?
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

i18n.use(initReactI18next).init({
  ns: ["dev", "common"],
  resources: {
    "en-US": {
      dev: require("./en-US/dev.json"),
      common: require("./en-US/common.json"),
      error: require("./en-US/error.json"),
      "header-menu": require("./en-US/header-menu.json"),
      overview: require("./en-US/overview.json"),
      footer: require("./en-US/footer.json"),
      meals: require("./en-US/meals.json"),
      meal: require("./en-US/meal.json"),
      "shopping-list": require("./en-US/shopping-list.json"),
      "meal-plan": require("./en-US/meal-plan.json"),
      search: require("./en-US/search.json"),
      "switch-modal": require("./en-US/switch-modal.json"),
      settings: require("./en-US/settings.json"),
      auth: require("./en-US/auth.json"),
      countries: countries.getNames("en", { select: "official" }),
    },
  },
  lng: "en-US",
  fallbackLng: "en-US",
  defaultNS: "common",

  interpolation: {
    escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
  },
});
