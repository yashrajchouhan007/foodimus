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
import { Section, StyledSelectFormField } from "@/Partials/user/SettingsForm";
import { SwitchFormField } from "@/Components/foodimus/Switch";

enum UnitType {
  "IMPERIAL" = 1,
  "METRIC" = 2,
}
type Props = SettingsPageData & {
  preferences?: Partial<{
    applyGoals: boolean;
    unitType: UnitType;
    timezone: string;
  }>;
  timezones?: string[];
};
export const PersonalPage = ({ preferences, timezones, ...p }: Props) => {
  const { t } = useTranslation("settings");
  const { route } = useRoute();
  return (
    <Layout {...p}>
      <H3>{t("form.preferences.title")}</H3>
      <Separator size={3} color="purpleA15" />
      <Formik
        enableReinitialize
        initialValues={preferences || {}}
        onSubmit={formSubmitHandler(
          route("user-update-preferences"),
          preferences
        )}
      >
        <>
          <FormikPatchTouched />
          <Section>
            <StyledSelectFormField
              name="unitType"
              label={
                <BodyText variant="bold">
                  {t("form.preferences.unit-type.label")}
                </BodyText>
              }
            >
              <Option value={UnitType.IMPERIAL}>
                {t("form.preferences.unit-type.imperial.label")}
              </Option>
              <Option value={UnitType.METRIC}>
                {t("form.preferences.unit-type.metric.label")}
              </Option>
            </StyledSelectFormField>

            <StyledSelectFormField
              name="timezone"
              label={
                <BodyText variant="bold">
                  {t("form.preferences.timezone.label")}
                </BodyText>
              }
            >
              {timezones?.map((i) => (
                <Option key={i} value={i}>
                  {i.replace(/_/g, " ")}
                </Option>
              ))}
            </StyledSelectFormField>

            <SwitchFormField
              name="applyGoals"
              label={
                <BodyText variant="bold">
                  {t("form.preferences.apply-goals.label")}
                </BodyText>
              }
            />

            <div>
              <Button type="submit">
                {t("form.preferences.submit.label")}
              </Button>
            </div>
          </Section>
        </>
      </Formik>
    </Layout>
  );
};

export default PersonalPage;
