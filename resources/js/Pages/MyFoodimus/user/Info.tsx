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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { definition as faEdit } from "@fortawesome/free-solid-svg-icons/faEdit";
import { definition as faInfoCircle } from "@fortawesome/free-solid-svg-icons/faInfoCircle";

import {
  Section,
  StyledTextFormField,
  StyledDateFormField,
  StyledSelectFormField,
  StyledPhoneFormField,
  StyledAvatarFormField,
} from "@/Partials/user/SettingsForm";
import countries from "i18n-iso-countries";
import Tooltip from "@/Components/foodimus/Tooltip";
import ControlText from "@/Components/foodimus/typography/ControlText";

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
      <H3>{t("form.user-info.title")}</H3>
      <Separator size={3} color="purpleA15" />
      <Formik
        enableReinitialize
        initialValues={info || {}}
        onSubmit={formSubmitHandler(route("user-update-info"), info)}
      >
        <>
          <FormikPatchTouched />
          <StyledAvatarFormField
            name="avatar"
            label={
              <div className="label">
                <FontAwesomeIcon icon={faEdit} />
                <span>{t("form.user-info.avatar.label")}</span>
              </div>
            }
          />
          <Separator />
          <Section>
            <StyledTextFormField
              required
              name="firstname"
              label={
                <BodyText variant="bold">
                  {t("form.user-info.firstname.label")} *
                </BodyText>
              }
            />
            <StyledTextFormField
              required
              name="lastname"
              label={
                <BodyText variant="bold">
                  {t("form.user-info.lastname.label")} *
                </BodyText>
              }
            />
            <StyledTextFormField
              name="email"
              disabled
              label={
                <BodyText variant="bold">
                  {t("form.user-info.email.label")}
                </BodyText>
              }
            />
            <StyledPhoneFormField
              required
              name="phone"
              label={
                <BodyText variant="bold">
                  {t("form.user-info.phone.label")} *
                </BodyText>
              }
            />
            <StyledDateFormField
              required
              name="dateOfBirth"
              label={
                <BodyText variant="bold">
                  {t("form.user-info.date-of-birth.label")} *
                </BodyText>
              }
            />
            <StyledSelectFormField
              name="gender"
              label={
                <BodyText variant="bold">
                  {t("form.user-info.gender.label")}{" "}
                  <Tooltip
                    contents={
                      <ControlText>
                        {t("form.user-info.gender.tooltip")}
                      </ControlText>
                    }
                  >
                    <FontAwesomeIcon icon={faInfoCircle} />
                  </Tooltip>
                </BodyText>
              }
            >
              <Option disabled value="">
                {t("form.user-info.gender.unset.label")}
              </Option>
              <Option value="m">{t("form.user-info.gender.m.label")}</Option>
              <Option value="f">{t("form.user-info.gender.f.label")}</Option>
              {/*<Option value="x">{t("form.user-info.gender.x.label")}</Option>*/}
            </StyledSelectFormField>
            <StyledTextFormField
              name="address"
              label={
                <BodyText variant="bold">
                  {t("form.user-info.address.label")}
                </BodyText>
              }
            />
            <StyledTextFormField
              name="houseNumber"
              label={
                <BodyText variant="bold">
                  {t("form.user-info.house-number.label")}
                </BodyText>
              }
            />
            <StyledTextFormField
              name="zipCode"
              label={
                <BodyText variant="bold">
                  {t("form.user-info.zip-code.label")}
                </BodyText>
              }
            />
            <StyledTextFormField
              name="city"
              label={
                <BodyText variant="bold">
                  {t("form.user-info.city.label")}
                </BodyText>
              }
            />
            <StyledSelectFormField
              required
              name="country"
              label={
                <BodyText variant="bold">
                  {t("form.user-info.country.label")} *
                </BodyText>
              }
            >
              <Option disabled></Option>
              {Object.keys(countries.getAlpha2Codes()).map((code) => (
                <Option key={code} value={code}>
                  {t(`countries:${code}`)}
                </Option>
              ))}
            </StyledSelectFormField>
            <div>
              <Button type="submit">{t("form.user-info.submit.label")}</Button>
            </div>
          </Section>
        </>
      </Formik>
    </Layout>
  );
};

export default InfoPage;
