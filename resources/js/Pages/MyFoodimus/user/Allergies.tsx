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
import { Section } from "@/Partials/user/SettingsForm";
import { MultiselectFormField } from "@/Components/foodimus/Multiselect";

type Props = SettingsPageData & {
  allergies?: {
    checked: { label: string; value: string | number }[];
    options: { label: string; value: string | number }[];
  };
};
export const PersonalPage = ({ allergies, ...p }: Props) => {
  const { t } = useTranslation("settings");
  const { route } = useRoute();
  return (
    <Layout {...p}>
      {!!allergies?.options?.length && (
        <>
          <H3>{t("form.allergies.title")}</H3>
          <Separator size={3} color="purpleA15" />
          <Formik
            enableReinitialize
            initialValues={{ allergies: allergies.checked }}
            onSubmit={formSubmitHandler(route("user-update-allergies"), {
              allergies: allergies.checked,
            })}
          >
            <>
              <FormikPatchTouched />
              <Section className="full-width">
                <MultiselectFormField
                  name="allergies"
                  options={allergies.options}
                  label={
                    <BodyText variant="bold">
                      {t("form.allergies.label")}
                    </BodyText>
                  }
                />
                <div>
                  <Button type="submit">
                    {t("form.allergies.submit.label")}
                  </Button>
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
