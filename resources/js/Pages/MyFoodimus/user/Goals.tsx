import { Option } from "@/Components/foodimus/Select";
import Separator from "@/Components/foodimus/Separator";
import BodyText from "@/Components/foodimus/typography/BodyText";
import { H3 } from "@/Components/foodimus/typography/Headings";
import Layout, { Data as SettingsPageData } from "@/Layouts/SettingsPage";
import React from "react";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import Button from "@/Components/foodimus/Button";
import useRoute from "@/Hooks/useRoute";
import formSubmitHandler from "@/Helpers/formSubmitHandler";
import { FormikPatchTouched } from "@/Components/foodimus/FormikPatchTouched";
import {
  Section,
  StyledSelectFormField,
  StyledNumberFormField,
} from "@/Partials/user/SettingsForm";
import Markdown from "@/Components/foodimus/Markdown";
import styled from "styled-components";

const StyledMarkdown = styled(Markdown)`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

type GoalsFormData = {
  weight: number;
  height: number;
  targetWeight: number;
  activityLevel: string;
  weeklyGoal: string;
};
type Units = {
  set: string;
  weight: string;
  height: string;
  targetWeight: string;
};
type Props = SettingsPageData & {
  preferences?: Partial<{
    applyGoals: boolean;
  }>;
  goals?: Partial<GoalsFormData>;
  units?: Partial<Units>;
  activityLevels?: { [value: string]: string };
  weeklyGoals?: { [value: string]: string };
};
export const PersonalPage = ({
  preferences,
  goals,
  units,
  activityLevels,
  weeklyGoals,
  ...p
}: Props) => {
  const { t } = useTranslation("settings");
  const { route } = useRoute();
  return (
    <Layout {...p}>
      {!preferences?.applyGoals ? (
        <StyledMarkdown
          components={{
            hr: () => <Separator size={3} color="purpleA15" />,
          }}
        >
          {t("form.goals.title-disabled")}
        </StyledMarkdown>
      ) : (
        <>
          <H3>{t("form.goals.title")}</H3>
          <Separator size={3} color="purpleA15" />
          <Formik
            enableReinitialize
            initialValues={goals || {}}
            onSubmit={formSubmitHandler(route("user-update-goals"), goals)}
          >
            <>
              <FormikPatchTouched />
              <Section>
                <StyledNumberFormField
                  width={150}
                  name="weight"
                  unit={units?.weight}
                  label={
                    <BodyText variant="bold">
                      {t("form.goals.weight.label")}
                    </BodyText>
                  }
                />
                <StyledNumberFormField
                  width={150}
                  name="targetWeight"
                  unit={units?.targetWeight}
                  label={
                    <BodyText variant="bold">
                      {t("form.goals.target-weight.label")}
                    </BodyText>
                  }
                />
                <StyledNumberFormField
                  width={150}
                  name="height"
                  unit={units?.height}
                  label={
                    <BodyText variant="bold">
                      {t("form.goals.height.label")}
                    </BodyText>
                  }
                />
                <StyledSelectFormField
                  name="activityLevel"
                  label={
                    <BodyText variant="bold">
                      {t("form.goals.activity-level.label")}
                    </BodyText>
                  }
                >
                  {activityLevels &&
                    Object.entries(activityLevels).map(([v, k]) => (
                      <Option key={v} value={v}>
                        {t(`form.goals.activity-level.options.${k}.label`)}
                      </Option>
                    ))}
                </StyledSelectFormField>
                <StyledSelectFormField
                  name="weeklyGoal"
                  label={
                    <BodyText variant="bold">
                      {t("form.goals.weekly-goal.label")}
                    </BodyText>
                  }
                >
                  {weeklyGoals &&
                    Object.entries(weeklyGoals).map(([v, k]) => (
                      <Option key={v} value={v}>
                        {t(
                          `form.goals.weekly-goal.options.${k}.${units?.set}.label`
                        )}
                      </Option>
                    ))}
                </StyledSelectFormField>

                <div>
                  <Button type="submit">{t("form.goals.submit.label")}</Button>
                </div>
              </Section>
            </>
          </Formik>
        </>
      )}
    </Layout>
  );
};

export default PersonalPage;
