/**
 * An error boundary catches errors from underlaying React components and renders something else instead
 * This one also sends the errors to Sentry
 */
import React from "react";
import BodyText from "./typography/BodyText";
import * as Sentry from "@sentry/react";

type Props = {
  children: React.ReactNode;
  errorMessage?: React.ReactNode;
};

export const ErrorBoundary = ({ children, errorMessage }: Props) => (
  <Sentry.ErrorBoundary
    showDialog={process.env.NODE_ENV !== "production"}
    fallback={() => {
      if (errorMessage) return <>{errorMessage}</>;
      return (
        <BodyText>An error occurred while loading this component</BodyText>
      );
    }}
  >
    <>{children}</>
  </Sentry.ErrorBoundary>
);
export default ErrorBoundary;
