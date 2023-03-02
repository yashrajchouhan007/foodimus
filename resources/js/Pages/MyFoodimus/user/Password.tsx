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

import { Section, StyledTextFormField } from "@/Partials/user/SettingsForm";

const initialPasswordValues = {
  oldPassword: "",
  newPassword: "",
  verifyPassword: "",
};
type UserInfoFormData = {
  avatar: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  dateOfBirth: {
    year: number;
    month: number;
    day: number;
  };
  gender: string;
  address: string;
  houseNumber: string;
  zipCode: string;
  city: string;
  country: string;
};
type Props = SettingsPageData & {
  info?: Partial<UserInfoFormData>;
};
export const InfoPage = ({ info, ...p }: Props) => {
  const { t } = useTranslation("settings");
  const { route } = useRoute();
  return (
    <Layout {...p}>
      <H3>{t("form.password.title")}</H3>
      <Separator size={3} color="purpleA15" />
      <Formik
        enableReinitialize
        initialValues={initialPasswordValues}
        validate={({ newPassword, verifyPassword }) => {
          if (newPassword !== verifyPassword) {
            return {
              verifyPassword: t("form.password.error.no-match") as string,
            };
          }
        }}
        onSubmit={formSubmitHandler(
          route("user-update-password"),
          initialPasswordValues
        )}
      >
        <>
          <FormikPatchTouched />
          <Section>
            <StyledTextFormField
              required
              type="password"
              name="oldPassword"
              label={<BodyText variant="bold">Old password</BodyText>}
            />
            <StyledTextFormField
              required
              type="password"
              name="newPassword"
              label={<BodyText variant="bold">New password</BodyText>}
            />
            <StyledTextFormField
              required
              type="password"
              name="verifyPassword"
              label={<BodyText variant="bold">Verify new password</BodyText>}
            />
            <div>
              <Button type="submit">Save Changes</Button>
            </div>
          </Section>
        </>
      </Formik>
    </Layout>
  );
};

export default InfoPage;
