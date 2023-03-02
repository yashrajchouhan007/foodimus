import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Button, { LinkButton } from "@/Components/foodimus/Button";
import useRoute from "@/Hooks/useRoute";
import formatDate from "@/Helpers/formatDate";
import { DateTime } from "luxon";
import Section from "./Section";
import { StyledModal as InnerStyledModal } from "@/Layouts/FoodimusPage";
import { H2 } from "@/Components/foodimus/typography/Headings";
import Markdown from "@/Components/foodimus/Markdown";
import ButtonContainer from "@/Components/foodimus/ButtonContainer";
import Fill from "@/Components/foodimus/Fill";
import styled from "styled-components";
import ToggleButtonGroup from "@/Components/foodimus/ToggleButtonGroup";
import Switch from "@/Components/foodimus/Switch";
import { PaymentType, Prices } from "@/Types/page-data";
import formatCurrency from "@/Helpers/formatCurrency";
import breakpoints from "@/Theme/breakpoints";

const StyledModal = styled(InnerStyledModal)`
  @media ${breakpoints.tablet} {
    width: 700px;
  }
`;

const StyledModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  gap: 20px;
  flex: 1;
`;

const StyledToggleButtonGroup = styled(ToggleButtonGroup)`
  align-self: stretch;
  > label {
    flex: 1;
    justify-content: center;
  }
`;

const StyledLabel = styled.label`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
`;
const Label = styled.div`
  text-align: center;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

type TermsAgreeProps = {
  termsAgreed: boolean;
  setTermsAgreed: (value: boolean) => void;
};
const TermsAgree = ({ termsAgreed, setTermsAgreed }: TermsAgreeProps) => {
  const { t } = useTranslation("settings");
  return (
    <StyledLabel>
      <Switch
        onChange={(checked) => {
          setTermsAgreed(checked);
        }}
        checked={termsAgreed}
      />
      <Markdown linkAsAnchor>{t("agree-terms.label")}</Markdown>
    </StyledLabel>
  );
};

type SelectPaymentTypeProps = {
  paymentType: PaymentType;
  setPaymentType: (value: PaymentType) => void;
  prices: Prices;
};
const SelectPaymentType = ({
  paymentType,
  prices,
  setPaymentType,
}: SelectPaymentTypeProps) => {
  const { t } = useTranslation("settings");

  const formattedPrices = Object.fromEntries(
    Object.entries(prices).map(([k, v]) => [k, formatCurrency(t, v)])
  );
  const formattedPrice = formattedPrices[paymentType];

  return (
    <>
      <StyledToggleButtonGroup
        value={paymentType}
        onChange={(value: PaymentType) => {
          setPaymentType(value);
        }}
      >
        {Object.entries(formattedPrices).map(([k, v]) => ({
          label: (
            <Label>
              <Markdown>
                {t(`select-payment-type.label.${k}`, {
                  price: v,
                })}
              </Markdown>
            </Label>
          ),
          value: k,
        }))}
      </StyledToggleButtonGroup>
      <Markdown linkAsAnchor>
        {t(`select-payment-type.content.${paymentType}`, {
          price: formattedPrice,
        })}
      </Markdown>
    </>
  );
};

type ModalProps = {
  onClose: () => void;
  prices: Prices;
};
const ModalSubscribe = ({ onClose, prices }: ModalProps) => {
  const [paymentType, setPaymentType] = useState("yearly" as PaymentType);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const { t } = useTranslation("settings");
  const { route } = useRoute();
  return (
    <StyledModal>
      <H2>{t("modal.subscription-create.title")}</H2>
      <StyledModalContent>
        <Markdown>{t("modal.subscription-create.content")}</Markdown>
        <SelectPaymentType
          prices={prices}
          {...{ paymentType, setPaymentType }}
        />
        <TermsAgree {...{ termsAgreed, setTermsAgreed }} />
        <Fill />
        <ButtonContainer>
          <LinkButton
            disabled={!termsAgreed}
            href={route("subscription.subscribe", {
              paymentType,
            })}
          >
            {t("modal.subscription-create.button-proceed")}
          </LinkButton>
          <Button color="red" onClick={() => onClose()}>
            {t("modal.subscription-create.button-cancel")}
          </Button>
        </ButtonContainer>
      </StyledModalContent>
    </StyledModal>
  );
};
const ModalResume = ({ onClose, prices }: ModalProps) => {
  const [paymentType, setPaymentType] = useState("yearly" as PaymentType);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const { t } = useTranslation("settings");
  const { route } = useRoute();
  return (
    <StyledModal>
      <H2>{t("modal.subscription-uncancel.title")}</H2>
      <StyledModalContent>
        <Markdown>{t("modal.subscription-uncancel.content")}</Markdown>
        <SelectPaymentType
          prices={prices}
          {...{ paymentType, setPaymentType }}
        />
        <TermsAgree {...{ termsAgreed, setTermsAgreed }} />
        <Fill />
        <ButtonContainer>
          <LinkButton
            disabled={!termsAgreed}
            href={route("subscription.subscribe", {
              paymentType,
            })}
          >
            {t("modal.subscription-subscribe.button-proceed")}
          </LinkButton>
          <Button color="red" onClick={() => onClose()}>
            {t("modal.subscription-subscribe.button-cancel")}
          </Button>
        </ButtonContainer>
      </StyledModalContent>
    </StyledModal>
  );
};
const ModalCancel = ({ onClose }: ModalProps) => {
  const { t } = useTranslation("settings");
  const { route } = useRoute();
  return (
    <StyledModal>
      <H2>{t("modal.subscription-cancel.title")}</H2>
      <StyledModalContent>
        <Markdown>{t("modal.subscription-cancel.content")}</Markdown>
        <Fill />
        <ButtonContainer>
          <LinkButton color="red" href={route("subscription.cancel")}>
            {t("modal.subscription-cancel.button-proceed")}
          </LinkButton>
          <Button onClick={() => onClose()}>
            {t("modal.subscription-cancel.button-cancel")}
          </Button>
        </ButtonContainer>
      </StyledModalContent>
    </StyledModal>
  );
};

export type SubscriptionData = {
  status:
    | "incomplete"
    | "incomplete_expired"
    | "trialing"
    | "active"
    | "past_due"
    | "canceled"
    | "unpaid";
  cancel_at_period_end: boolean;
  renewal?: string | null;
  payment_type?: "yearly" | "monthly";
};
type Props = SubscriptionData & {
  setModal: (m: React.ReactNode) => void;
  prices?: Prices;
};
export const Subscription = ({
  status,
  cancel_at_period_end,
  renewal,
  payment_type,
  prices,
  setModal,
}: Props) => {
  const { t } = useTranslation("settings");

  return (
    <>
      <div>
        {t(
          `form.subscription.status.${
            cancel_at_period_end ? "cancel_at_period_end" : status
          }`,
          {
            renewal: renewal
              ? formatDate(t, DateTime.fromISO(renewal), {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                })
              : "?",
          }
        )}
      </div>
      {!!payment_type && !cancel_at_period_end && (
        <div>{t(`form.subscription.type.${payment_type}`)}</div>
      )}
      {prices && (
        <Section>
          {cancel_at_period_end ? (
            <Button
              onClick={() => {
                setModal(
                  <ModalResume prices={prices} onClose={() => setModal(null)} />
                );
              }}
            >
              {t("form.subscription.button-uncancel.label")}
            </Button>
          ) : ["canceled", "incomplete"].includes(status) ? (
            <Button
              onClick={() => {
                setModal(
                  <ModalSubscribe
                    prices={prices}
                    onClose={() => setModal(null)}
                  />
                );
              }}
            >
              {t("form.subscription.button-subscribe.label")}
            </Button>
          ) : (
            <Button
              onClick={() => {
                setModal(
                  <ModalCancel prices={prices} onClose={() => setModal(null)} />
                );
              }}
            >
              {t("form.subscription.button-cancel.label")}
            </Button>
          )}
        </Section>
      )}
    </>
  );
};
export default Subscription;
