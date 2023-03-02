/**
 * A text field that only accepts numbers
 */
import styled from "styled-components";
import TextField from "./TextField";
import { useField, FieldHookConfig } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";
import { getSizeOnly, Size } from "@/Helpers/size";

export const NumberField = styled(TextField).attrs((props) => ({
  type: props.type || "number",
}))`
  // Remove spinner control
  -moz-appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;
export default NumberField;

type FormikProps = {
  name: string;
  required?: boolean;
  width?: Size;
} & FieldHookConfig<number>;

export const NumberFormField = ({
  label,
  unit,
  className,
  required,
  width,
  validate,
  ...p
}: { label: React.ReactNode } & React.ComponentProps<typeof NumberField> &
  FormikProps) => {
  const { t } = useTranslation();
  const [{ value, ...field }, meta] = useField<number>({
    validate: (value) => {
      if (required && (value === "" || value === null || value === undefined))
        return t("form.general.error.required") as string;
      if (validate) return validate(value);
    },
    ...p,
  });
  return (
    <label className={className}>
      {label}
      <NumberField
        invalid={meta.touched && meta.error}
        width={width !== undefined ? getSizeOnly(width) : "100%"}
        value={value || null}
        unit={unit}
        {...field}
        {...p}
      />
      {meta.error && meta.touched && <div className="error">{meta.error}</div>}
    </label>
  );
};
