import Button, { GhostButton } from "@/Components/foodimus/Button";
import ButtonContainer from "@/Components/foodimus/ButtonContainer";
import Fill from "@/Components/foodimus/Fill";
import { H2, H3 } from "@/Components/foodimus/typography/Headings";
import MultilineText from "@/Components/foodimus/typography/MultilineText";
import useRoute from "@/Hooks/useRoute";
import { StyledModal } from "@/Layouts/FoodimusPage";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Inertia } from "@inertiajs/inertia";
import Spinner from "@/Components/foodimus/Spinner";
import BodyText from "@/Components/foodimus/typography/BodyText";

type Props = {
  onClose: () => void;
  slug: string;
  isRestart?: boolean;
  hasPlan?: boolean;
};

export const SwitchMealPlanModal = ({
  onClose,
  slug,
  isRestart,
  hasPlan,
}: Props) => {
  const [working, setWorking] = useState(false);
  const { t } = useTranslation("switch-modal");
  const ns = working
    ? "working"
    : isRestart
    ? "restart"
    : hasPlan
    ? "activate-overwrite"
    : "activate";
  const { route } = useRoute();
  return working ? (
    <StyledModal align="center" gap={20}>
      <Spinner color="purple" width={64} />
      <H3>{t(`${ns}.title`)}</H3>
      <BodyText align="center">{t(`${ns}.content`)}</BodyText>
    </StyledModal>
  ) : (
    <StyledModal gap={20}>
      <H2>{t(`${ns}.title`)}</H2>
      <MultilineText>{t(`${ns}.content`)}</MultilineText>
      <Fill />
      <ButtonContainer>
        <Button
          disabled={working}
          color="red"
          onClick={async () => {
            setWorking(true);

            await new Promise<void>((res, rej) =>
              Inertia.post(
                route("activate-meal-plan", {
                  slug,
                }),
                undefined,
                {
                  onFinish: res,
                  onError: rej,
                }
              )
            );
            setWorking(false);
            onClose();
          }}
        >
          {t(`${ns}.button-proceed`)}
        </Button>
        <GhostButton
          disabled={working}
          onClick={() => {
            onClose();
          }}
        >
          {t(`${ns}.button-cancel`)}
        </GhostButton>
      </ButtonContainer>
    </StyledModal>
  );
};

export default SwitchMealPlanModal;
