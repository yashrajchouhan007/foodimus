import useRoute from "@/Hooks/useRoute";
import { FormEvent, useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { StripeError } from "@stripe/stripe-js";

export type Billing = {
  name: string;
  phone?: string;
  email: string;
};
export type StripeProps = {
  publicKey: string;
  secret: string;
  billing: Billing;
};
export type StripeCardFormProps = Omit<StripeProps, "publicKey"> & {
  internalRedirect: {
    success: string | null;
    error: string | null;
  };
};
const useStripeCardForm = ({
  secret,
  billing,
  internalRedirect,
}: StripeCardFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { route } = useRoute();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(undefined as undefined | StripeError);

  const handleSubmit = async (event: FormEvent) => {
    setBusy(true);
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const card = elements.getElement("card");
    if (card === null) return;

    const { setupIntent, error } = await stripe.confirmCardSetup(secret, {
      payment_method: {
        card,
        billing_details: billing,
      },
    });

    if (error) {
      setBusy(false);
      setError(error);
      return;
    }

    Inertia.post(route("payment_method.save"), {
      intent: setupIntent,
      internalRedirect,
    });
  };
  return {
    stripe,
    busy,
    error,
    setBusy,
    handleSubmit,
  };
};

export default useStripeCardForm;
