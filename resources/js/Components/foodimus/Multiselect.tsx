/**
 * A box containing multiple toggle buttons
 */
import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";
import React from "react";
import styled from "styled-components";
import { useField, FieldHookConfig } from "formik";
import { useTranslation } from "react-i18next";

const HiddenCheckbox = styled.input.attrs({
  type: "checkbox",
})`
  display: none;
`;
const StyledLabel = styled.label.withConfig(hidePropsFromHtml("checked"))<{
  checked?: boolean;
}>`
  user-select: none;
  display: inline-block;
  border-radius: 5px;
  padding: 12px 10px 9px;
  color: ${(props) => (props.checked ? props.theme.colors.white : "inherit")};
  background-color: ${(props) =>
    props.checked ? props.theme.colors.purple : "initial"};
  border: solid thin
    ${(props) =>
      props.checked
        ? props.theme.colors.purple
        : props.theme.colors.purpleBorder};
  transition: background-color 100ms linear, border 100ms linear;
`;

const StyledContainer = styled.div`
  font-family: ${(props) => props.theme.fonts.control};
  font-size: 16px;
  line-height: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

type Option<ValueType = any> = {
  label: string | React.ReactNode;
  value: ValueType;
};
type Props<ValueType = string | number> = {
  options?: Option<ValueType>[];
  checked: ValueType[];
  onCheckedChanged: (checked: ValueType[]) => void;
};

type MultiSelectItemProps = React.ComponentProps<typeof HiddenCheckbox> & {
  children: React.ReactNode;
};
const MultiSelectItem = ({ children, ...p }: MultiSelectItemProps) => (
  <StyledLabel checked={p.checked}>
    <HiddenCheckbox {...p} />
    <span>{children}</span>
  </StyledLabel>
);
export const Multiselect = ({ options, checked, onCheckedChanged }: Props) => (
  <StyledContainer>
    {options?.map(({ label, value }) => (
      <MultiSelectItem
        key={value}
        checked={checked.indexOf(value) >= 0}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (e.target.checked) {
            onCheckedChanged([...checked, value]);
          } else {
            onCheckedChanged(checked.filter((i) => i !== value));
          }
        }}
      >
        {label}
      </MultiSelectItem>
    ))}
  </StyledContainer>
);

export default Multiselect;

type FormValueType = (string | number)[];
type FormikProps = {
  name: string;
  options: { label: string; value: string | number }[];
  required?: boolean;
} & FieldHookConfig<FormValueType>;

export const MultiselectFormField = ({
  label,
  className,
  required,
  validate,
  onChange: _,
  options,
  ...p
}: { label: React.ReactNode } & FormikProps) => {
  const { t } = useTranslation();
  const [{ value, onChange: _onChange, ...field }, meta, { setValue }] =
    useField<FormValueType>({
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
      <Multiselect
        options={options}
        checked={value}
        onCheckedChanged={(checked) => {
          // copy so we can detect that it has changed
          setValue([...checked], true);
        }}
      />
      {meta.error && meta.touched && <div className="error">{meta.error}</div>}
    </label>
  );
};
