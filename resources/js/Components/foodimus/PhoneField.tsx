import baseFormControlStyle from "@/Theme/formStyle";
import React from "react";
import styled from "styled-components";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { useField, FieldHookConfig } from "formik";
import { useTranslation } from "react-i18next";
import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";

const StyledInput = styled(PhoneInput).withConfig<{
  width?: number | string;
  noFill?: boolean;
  disabled?: boolean;
  invalid?: boolean;
}>(hideProps("width", "hasUnit", "noFill", "invalid"))`
  ${baseFormControlStyle}
  width: ${({ width }) => width || "139px"};
  height: 37px;
  border-radius: 5px;
  line-height: 16px;
  padding: 2px 10px 0 10px;

  &::placeholder {
    color: ${(props) => props.theme.colors.purpleBorder};
  }

  display: flex;
  align-items: center;
  .PhoneInputInput {
    flex: 1;
    min-width: 0;
  }
  .PhoneInputCountryIcon {
    width: 1.5em;
    height: 1em;
  }
  .PhoneInputCountryIcon--square {
    width: 1em;
  }
  .PhoneInputCountryIcon--border {
    background-color: rgba(0, 0, 0, 0.1);
  }
  .PhoneInputCountryIconImg {
    display: block;
    width: 100%;
    height: 100%;
  }
  .PhoneInputCountry {
    position: relative;
    align-self: stretch;
    display: flex;
    align-items: center;
    margin-right: 0.5em;
    top: -2px;
  }

  .PhoneInputCountrySelect {
    position: absolute;
    top: -1px;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 1;
    border: 0;
    opacity: 0;
    cursor: pointer;
  }

  .PhoneInputCountrySelect[disabled] {
    cursor: default;
  }

  .PhoneInputCountrySelectArrow {
    display: block;
    content: "";
    width: 0.3em;
    height: 0.3em;
    margin-left: 0.35em;
    border-style: solid;
    border-color: inherit;
    border-top-width: 0;
    border-bottom-width: 1px;
    border-left-width: 0;
    border-right-width: 1px;
    transform: rotate(45deg);
    opacity: 0.45;
  }

  .PhoneInputCountrySelect:focus
    + .PhoneInputCountryIcon
    .PhoneInputInternationalIconGlobe {
    opacity: 0;
  }
`;

type Props = React.ComponentProps<typeof StyledInput> & {
  className?: string;
};

const PhoneField = ({ className, ...p }: Props) => {
  return (
    <span className={className}>
      <StyledInput {...p} />
    </span>
  );
};
export default PhoneField;

type FormProps = Props &
  FieldHookConfig<string> & {
    label: React.ReactNode;
    name: string;
    required?: boolean;
    className?: string;
  };

export const PhoneFormField = ({
  label,
  className,
  required,
  validate,
  ...p
}: FormProps) => {
  const { t } = useTranslation();
  const [{ onChange: _onChange, value, ...field }, meta, { setValue }] =
    useField<string>({
      validate: (value) => {
        if (required && !value)
          return t("form.general.error.required") as string;
        if (value)
          if (!isValidPhoneNumber(value))
            return t("form.phone.error.invalid") as string;
        if (validate) return validate(value);
      },
      ...p,
    });
  return (
    <label className={className}>
      {label}
      <PhoneField
        invalid={meta.touched && meta.error}
        width="100%"
        value={value || ""}
        onChange={(v: string) => setValue(v, true)}
        {...field}
        {...p}
      />
      {meta.error && meta.touched && <div className="error">{meta.error}</div>}
    </label>
  );
};
