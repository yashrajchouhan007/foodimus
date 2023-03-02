/**
 * A context provider for Stripe. Will load Stripe asynchronously and only
 * show its contents once it's available
 */

import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { useTranslation } from "react-i18next";

type Props = {
  children: React.ReactNode;
  publicKey: string;
} & Omit<React.ComponentProps<typeof Elements>, "stripe">;
const StripeContext = ({ children, publicKey, ...p }: Props) => {
  const { t } = useTranslation();
  const [stripe, setStripe] = useState<Promise<Stripe | null> | null>(null);
  useEffect(() => {
    setStripe(loadStripe(publicKey));
  }, [publicKey]);
  return (
    <>
      {stripe && (
        <Elements
          options={{
            locale: t("common:stripe.locale", "en"),
            fonts: [
              { cssSrc: "https://fonts.cdnfonts.com/css/gilroy-bold" },
              {
                cssSrc:
                  "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap",
              },
            ],
          }}
          {...p}
          stripe={stripe}
        >
          {children}
        </Elements>
      )}
    </>
  );
};

export default StripeContext;
