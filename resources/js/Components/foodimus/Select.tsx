import React from "react";
import styled from "styled-components";
import { definition as faSortDown } from "@fortawesome/free-solid-svg-icons/faSortDown";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import baseFormControlStyle from "@/Theme/formStyle";
import { useField, FieldHookConfig } from "formik";
import { useTranslation } from "react-i18next";
import { getSizeOnly, Size } from "@/Helpers/size";
import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";

export const Option = styled.option``;

const StyledSelect = styled.select.withConfig<{
  width?: number;
  minWidth?: number;
  noFill?: boolean;
  disabled?: boolean;
  invalid?: boolean;
}>(hidePropsFromHtml("width", "minWidth", "noFill", "invalid"))`
  ${baseFormControlStyle}
  width: ${(props) => props.width || "auto"};
  min-width: ${(props) => props.minWidth || "auto"};
  height: 37px;
  border-radius: 5px;
  line-height: 16px;
  padding: 2px 30px 0 10px;

  &::placeholder {
    color: ${(props) => props.theme.colors.purpleBorder};
  }
`;
const SelectArrow = styled(FontAwesomeIcon)`
  position: absolute;
  right: 10px;
  height: 30px;
  pointer-events: none;
`;
const StyledContainer = styled.span`
  position: relative;
`;

type Props = React.ComponentProps<typeof StyledSelect> & {
  className?: string;
};
const Select = ({ className, ...p }: Props) => (
  <StyledContainer className={className}>
    <StyledSelect {...p} />
    <SelectArrow icon={faSortDown} />
  </StyledContainer>
);
export default Select;

type Value = string | number;
type FormikProps = {
  name: string;
  required?: boolean;
  width?: Size;
  className?: string;
} & FieldHookConfig<Value>;

export const SelectFormField = ({
  label,
  className,
  required,
  validate,
  width,
  ...p
}: { label: React.ReactNode } & Props & FormikProps) => {
  const { t } = useTranslation();
  const [{ value, ...field }, meta] = useField<Value>({
    validate: (value) => {
      if (required && (value === "" || value === undefined || value === null))
        return t("form.general.error.required") as string;
      if (validate) return validate(value);
    },
    ...p,
  });
  return (
    <label className={className}>
      {label}
      <Select
        invalid={meta.error}
        width={width !== undefined ? getSizeOnly(width) : "100%"}
        value={value || ""}
        {...field}
        {...p}
      />
      {meta.error && meta.touched && <div className="error">{meta.error}</div>}
    </label>
  );
};
