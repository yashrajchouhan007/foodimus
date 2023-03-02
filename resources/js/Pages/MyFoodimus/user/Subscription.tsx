import Separator from "@/Components/foodimus/Separator";
import { H3 } from "@/Components/foodimus/typography/Headings";
import Layout, { Data as SettingsPageData } from "@/Layouts/SettingsPage";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useRoute from "@/Hooks/useRoute";
import { PaymentMethod } from "@stripe/stripe-js";
import Subscription, {
  SubscriptionData,
} from "@/Partials/user/subscription/Subscription";
import Invoices, { InvoiceData } from "@/Partials/user/subscription/Invoices";
import PaymentMethods from "@/Partials/user/subscription/PaymentMethods";
import AddPaymentMethod from "@/Partials/user/subscription/AddPaymentMethod";
import { Inertia } from "@inertiajs/inertia";
import ErrorBoundary from "@/Components/foodimus/ErrorBoundary";
import { Billing } from "@/Hooks/useStripeCardForm";
import { Prices } from "@/Types/page-data";

type Props = SettingsPageData & {
  invoices?: InvoiceData[];
  subscription?: SubscriptionData;
  payment_methods?: PaymentMethod[];
  default_payment_method?: PaymentMethod;
  add_payment_method?: {
    secret: string;
    billing: Billing;
    publicKey: string;
    paymentType: string;
  };
  prices?: Prices;
};
type Params = {
  internalRedirect?: any;
};

export const SubscriptionPage = ({
  invoices,
  subscription,
  payment_methods,
  default_payment_method,
  add_payment_method,
  prices,
  ...p
}: Props) => {
  const { t } = useTranslation("settings");
  const { route, params: _params } = useRoute();
  const params = _params as Params;
  const { internalRedirect } = params;
  const [modal, setModal] = useState(null as React.ReactNode);
  useEffect(() => {
    setModal(
      add_payment_method ? (
        <AddPaymentMethod
          onClose={() => {
            Inertia.get(route("user-subscription"));
          }}
          internalRedirect={
            internalRedirect || {
              success: route("user-subscription"),
              error: route("user-subscription"),
            }
          }
          {...add_payment_method}
        />
      ) : null
    );
  }, [add_payment_method]);
  return (
    <Layout modal={modal} {...p}>
      <H3>{t("form.subscription.title")}</H3>
      <Separator size={3} color="purpleA15" />
      <ErrorBoundary>
        <Subscription
          setModal={setModal}
          prices={prices}
          {...(subscription || {
            status: "canceled",
            cancel_at_period_end: false,
          })}
        />
      </ErrorBoundary>
      <H3>{t("form.payment-methods.title")}</H3>
      <Separator size={3} color="purpleA15" />
      <ErrorBoundary>
        {payment_methods && (
          <PaymentMethods
            onClickAdd={() => {
              Inertia.get(
                route("user-subscription", { modal: "add-payment-method" })
              );
            }}
            paymentMethods={payment_methods}
            defaultPaymentMethodId={default_payment_method?.id}
          />
        )}
      </ErrorBoundary>
      <H3>{t("form.invoices.title")}</H3>
      <Separator size={3} color="purpleA15" />
      <ErrorBoundary>
        {invoices && <Invoices invoices={invoices} />}
      </ErrorBoundary>
    </Layout>
  );
};

export default SubscriptionPage;
