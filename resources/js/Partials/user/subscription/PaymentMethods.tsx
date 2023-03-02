import React from "react";
import { useTranslation } from "react-i18next";
import { LinkButton } from "@/Components/foodimus/Button";
import useRoute from "@/Hooks/useRoute";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PaymentMethod } from "@stripe/stripe-js";
import { Inertia } from "@inertiajs/inertia";
import { definition as faAsterisk } from "@fortawesome/free-solid-svg-icons/faAsterisk";
import { definition as faCheckCircle } from "@fortawesome/free-solid-svg-icons/faCheckCircle";
import { definition as faCreditCard } from "@fortawesome/free-solid-svg-icons/faCreditCard";
import { definition as faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";

import { definition as faCcAmex } from "@fortawesome/free-brands-svg-icons/faCcAmex";
import { definition as faCcDinersClub } from "@fortawesome/free-brands-svg-icons/faCcDinersClub";
import { definition as faCcDiscover } from "@fortawesome/free-brands-svg-icons/faCcDiscover";
import { definition as faCcJcb } from "@fortawesome/free-brands-svg-icons/faCcJcb";
import { definition as faCcMastercard } from "@fortawesome/free-brands-svg-icons/faCcMastercard";
import { definition as faCcVisa } from "@fortawesome/free-brands-svg-icons/faCcVisa";

import Section from "./Section";

export type PaymentMethodData = PaymentMethod;

type Props = {
  paymentMethods: PaymentMethodData[];
  defaultPaymentMethodId?: string;
  onClickAdd?: () => void;
};

export const PaymentMethods = ({
  paymentMethods,
  defaultPaymentMethodId,
  onClickAdd,
}: Props) => {
  const { t } = useTranslation("settings");
  const { route } = useRoute();
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>{t("form.payment-methods.thead.type")}</th>
            <th>{t("form.payment-methods.thead.ends-with")}</th>
            <th>{t("form.payment-methods.thead.expires-at")}</th>
            <th>{t("form.payment-methods.thead.is-default")}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {paymentMethods.map((payment_method) => {
            const isDefault = payment_method.id === defaultPaymentMethodId;
            return (
              <tr key={payment_method.id}>
                <td>
                  <FontAwesomeIcon
                    icon={
                      {
                        amex: faCcAmex,
                        diners: faCcDinersClub,
                        discover: faCcDiscover,
                        jcb: faCcJcb,
                        mastercard: faCcMastercard,
                        visa: faCcVisa,
                      }[payment_method.card?.brand || ""] || faCreditCard
                    }
                  />
                </td>
                <td>{payment_method.card?.last4}</td>
                <td>
                  {payment_method.card?.exp_month}/
                  {payment_method.card?.exp_year}
                </td>
                <td>{isDefault && <FontAwesomeIcon icon={faCheckCircle} />}</td>
                <td>
                  {!isDefault && (
                    <LinkButton
                      size="md"
                      external
                      variant="ghost"
                      onClick={() =>
                        Inertia.post(route("payment_method.set_default"), {
                          id: payment_method.id,
                        })
                      }
                      title="Set as default"
                    >
                      <FontAwesomeIcon icon={faAsterisk}></FontAwesomeIcon>
                    </LinkButton>
                  )}
                </td>
                <td>
                  <LinkButton
                    size="md"
                    external
                    variant="ghost"
                    onClick={() =>
                      Inertia.post(route("payment_method.delete"), {
                        id: payment_method.id,
                      })
                    }
                    title="Remove"
                  >
                    <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                  </LinkButton>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Section>
        <LinkButton onClick={onClickAdd}>
          {t("form.payment-methods.button-add.label")}
        </LinkButton>
      </Section>
    </>
  );
};
export default PaymentMethods;
