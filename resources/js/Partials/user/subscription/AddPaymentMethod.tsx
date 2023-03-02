import Button, { GhostButton } from "@/Components/foodimus/Button";
import ButtonContainer from "@/Components/foodimus/ButtonContainer";
import Fill from "@/Components/foodimus/Fill";
import { H2 } from "@/Components/foodimus/typography/Headings";
import MultilineText from "@/Components/foodimus/typography/MultilineText";
import { StyledModal } from "@/Layouts/FoodimusPage";
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import useStripeCardForm, {
  StripeCardFormProps,
} from "@/Hooks/useStripeCardForm";
import StripeContext from "@/Components/foodimus/StripeContext";
import BodyText from "@/Components/foodimus/typography/BodyText";
import CardElement from "@/Components/foodimus/StripeCardElement";

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  gap: 20px;
  flex: 1;
`;

const StripeForm = ({
  secret,
  billing,
  internalRedirect,
  onClose,
}: StripeFormProps) => {
  const { t } = useTranslation("settings");

  const { stripe, busy, setBusy, error, handleSubmit } = useStripeCardForm({
    secret,
    billing,
    internalRedirect,
  });

  return (
    <>
      <H2>{t("modal.add-payment-method.title")}</H2>
      <MultilineText>{t("modal.add-payment-method.content")}</MultilineText>

      <StyledForm onSubmit={handleSubmit}>
        <CardElement />
        <Fill />
        {error && <BodyText color="red">{error.message}</BodyText>}
        <ButtonContainer>
          <Button color="red" disabled={!stripe || busy}>
            {t("modal.add-payment-method.button-proceed")}
          </Button>
          <GhostButton
            disabled={busy}
            onClick={() => {
              setBusy(true);
              onClose();
            }}
          >
            {t("modal.add-payment-method.button-cancel")}
          </GhostButton>
        </ButtonContainer>
      </StyledForm>
    </>
  );
};

type StripeFormProps = StripeCardFormProps & {
  onClose: () => void;
};
export type Props = {
  publicKey: string;
} & StripeFormProps;
export const AddPaymentMethod = ({
  onClose,
  secret,
  billing,
  internalRedirect,
  publicKey,
}: Props) => {
  return (
    <StyledModal gap={20}>
      <StripeContext publicKey={publicKey}>
        <StripeForm
          secret={secret}
          billing={billing}
          internalRedirect={internalRedirect}
          onClose={onClose}
        />
      </StripeContext>
    </StyledModal>
  );
};

export default AddPaymentMethod;
