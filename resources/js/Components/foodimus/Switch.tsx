import { Theme } from "@/Theme";
import React from "react";
import ReactSwitch, { ReactSwitchProps } from "react-switch";
import styled, { withTheme } from "styled-components";
import { useField, FieldHookConfig } from "formik";
import { useTranslation } from "react-i18next";

const StyledSwitch = styled(ReactSwitch)`
  & .react-switch-bg {
    border: solid thin ${(props) => props.theme.colors.purpleBorder};
  }
`;

type Props = {
  theme: Theme;
} & ReactSwitchProps;
/**
 * A styled switch component
 */
export const Switch = withTheme(({ theme, ...p }: Props) => {
  return (
    <StyledSwitch
      height={24}
      handleDiameter={18}
      width={43}
      checkedIcon={false}
      uncheckedIcon={false}
      offColor={theme.colors.white}
      onColor={theme.colors.purple}
      onHandleColor={theme.colors.white}
      offHandleColor={theme.colors.purple}
      {...p}
    />
  );
});
export default Switch;

type FormikProps = {
  name: string;
  required?: boolean;
} & FieldHookConfig<boolean>;

export const SwitchFormField = ({
  label,
  className,
  required,
  validate,
  onChange: _,
  ...p
}: { label: React.ReactNode } & FormikProps) => {
  const { t } = useTranslation();
  const [{ value, onChange: _onChange, ...field }, meta, { setValue }] =
    useField<boolean>({
      validate: (value) => {
        if (required && !value)
          return t("form.general.error.required") as string;
        if (validate) return validate(value);
      },
      ...p,
    });
  return (
    <label className={className}>
      {label}
      <Switch
        {...field}
        checked={value}
        onChange={(checked) => {
          setValue(checked, true);
        }}
      />
      {meta.error && meta.touched && <div className="error">{meta.error}</div>}
    </label>
  );
};
