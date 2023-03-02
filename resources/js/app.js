require("./bootstrap");

// Import modules...
import React from "react";
import { render } from "react-dom";
import { App } from "@inertiajs/inertia-react";
import { InertiaProgress } from "@inertiajs/progress";
import { ThemeProvider } from "styled-components";
import theme from "./Theme";
import breakpoints from "./Theme/breakpoints";
import { createGlobalStyle } from "styled-components";
import ErrorBoundary from "./Components/foodimus/ErrorBoundary";
import "./Translations";
import * as Sentry from "@sentry/react";
import ErrorPage from "./Pages/Error";
import { Integrations } from "@sentry/tracing";
import { Inertia } from "@inertiajs/inertia";

// Some basic styling
const GlobalStyle = createGlobalStyle`
  html{
    scroll-behavior: smooth;
  }
  :root{
    font-size: 14px;
  }
  body {
    color: ${(props) => props.theme.colors.dark};
    font-family: ${(props) => props.theme.fonts.sans};
    line-height: 29px;
    background-color: ${(props) => props.theme.colors.background};
    
    font-size: 14px;
    line-height: 24px;
    @media ${breakpoints.tablet}{
      font-size: 18px;
      line-height: 29px;
    }
  }
  *:focus, *:focus-visible{
    outline: none;
  }
  abbr[title]{
    text-decoration:none;
  }
`;

// Sentry debugging tool
Sentry.init({
  dsn: "https://ddf5173ef32946649af89e8313dbc11c@o369052.ingest.sentry.io/6134182",
  integrations: [new Integrations.BrowserTracing()],
  environment: process.env.NODE_ENV,
  release: process.env.MIX_APP_COMMIT,
  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0, // process.env.NODE_ENV === "production" ? 0.2 : 1.0,
});

// Google Tag Manager
Inertia.on("navigate", (event) => {
  // Make sure we register SPA navigation events in GTM
  try {
    const evt = {
      url: event.detail.page.url,
      event: "pageview",
    };
    window.dataLayer?.push(evt);
  } catch (e) {}
  try {
    const evt = event.detail.page?.props?.gtmEvent;
    if (evt) {
      if (Array.isArray(evt)) {
        evt.forEach((e) => window.dataLayer?.push(e));
      } else {
        window.dataLayer?.push(evt);
      }
    }
  } catch (e) {
    console.log(e);
  }
});

//TODO: remove this at some point
window.app_env = process.env.NODE_ENV;

// Render the page
const el = document.getElementById("app");
render(
  <ErrorBoundary>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <ErrorBoundary errorMessage={<ErrorPage status={500} />}>
        <App
          initialPage={JSON.parse(el.dataset.page)}
          resolveComponent={(name) => require(`./Pages/${name}`).default}
        />
      </ErrorBoundary>
    </ThemeProvider>
  </ErrorBoundary>,
  el
);

// Because the app is an SPA, we manually add a progress bar to indicate we're loading
InertiaProgress.init({ color: "#4B5563" });
