import baseFormControlStyle from "@/Theme/formStyle";
import React from "react";
import styled from "styled-components";
import { useField, FieldHookConfig } from "formik";
import { useTranslation } from "react-i18next";
import { getSizeOnly, Size } from "@/Helpers/size";
import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";

const StyledInput = styled.input
  .withConfig(
    hidePropsFromHtml("width", "height", "hasUnit", "noFill", "invalid")
  )
  .attrs((props) => ({
    type: props.type || "text",
  }))<{
  width?: number | string;
  height?: number | string;
  hasUnit?: boolean;
  noFill?: boolean;
  invalid?: boolean;
}>`
  ${baseFormControlStyle}
  width: ${({ width }) => width || "139px"};
  height: ${({ height }) => height || "37px"};
  border-radius: 5px;
  line-height: 16px;
  padding: 2px ${({ hasUnit }) => (hasUnit ? "40px" : "10px")} 0 10px;

  &::placeholder {
    color: ${(props) => props.theme.colors.purpleBorder};
  }
`;

const StyledUnit = styled.span<{
  "data-text": string;
}>`
  position: relative;
  font-family: ${(props) => props.theme.fonts.control};
  &:before {
    content: attr(data-text);
    position: absolute;
    margin-top: 3px;
    line-height: 35px;
    right: 10px;
    color: ${(props) => props.theme.colors.purpleBorder};
    pointer-events: none;
  }
`;

type Props = React.ComponentProps<typeof StyledInput> & {
  unit?: string;
  className?: string;
};

const TextField = ({ className, unit, ...p }: Props) => {
  return (
    <span className={className}>
      <StyledInput hasUnit={!!unit} {...p} />
      {!!unit && <StyledUnit data-text={unit} />}
    </span>
  );
};
export default TextField;

type FormikProps = {
  name: string;
  required?: boolean;
  width?: Size;
} & FieldHookConfig<string>;

export const TextFormField = ({
  label,
  unit,
  className,
  required,
  validate,
  width,
  ...p
}: { label: React.ReactNode } & Props & FormikProps) => {
  const { t } = useTranslation();
  const [{ value, ...field }, meta] = useField<string>({
    validate: (value) => {
      if (required && !value) return t("form.general.error.required") as string;
      if (validate) return validate(value);
    },
    ...p,
  });
  return (
    <label className={className}>
      {label}
      <TextField
        invalid={meta.touched && meta.error}
        width={width !== undefined ? getSizeOnly(width) : "100%"}
        value={value || ""}
        unit={unit}
        {...field}
        {...p}
      />
      {meta.error && meta.touched && <div className="error">{meta.error}</div>}
    </label>
  );
};
