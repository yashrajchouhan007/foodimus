import getTimezone from "@/Helpers/timezone";
import useRoute from "@/Hooks/useRoute";
import { Inertia } from "@inertiajs/inertia";
import { Widget } from "@typeform/embed-react";
import React from "react";
import styled from "styled-components";

const StyledTypeForm = styled(Widget)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;
type Props = {
  formId?: string;
};
export const OnboardingPage = ({ formId }: Props) => {
  const { route, params: _params } = useRoute();
  const { referer, c } = _params as { referer?: string; c?: string };
  return (
    formId && (
      <StyledTypeForm
        id={formId}
        onSubmit={({ responseId }) => {
          setTimeout(() => {
            Inertia.post(route("onboarding.store"), {
              c,
              referer,
              responseId,
              timezone: getTimezone(),
            });
          }, 3500);
        }}
        onQuestionChanged={(e) => {
          const question = e.ref;
          try {
            const evt = {
              url: window.location.toString(),
              event: "question-changed",
              question,
            };
            (window as any).dataLayer?.push(evt);
          } catch (e) {}
        }}
      />
    )
  );
};

export default OnboardingPage;
