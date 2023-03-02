/**
 * A directional control, like the one used for the carousel
 */

import React from "react";
import styled from "styled-components";
import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";

const HiddenRadio = styled.input.attrs({
  type: "radio",
})`
  display: none;
`;
const StyledLabel = styled.label.withConfig(hidePropsFromHtml("checked"))<{
  checked?: boolean;
}>`
  user-select: none;
  display: inline-block;
  padding: 12px 15px 9px;
  color: ${(props) => (props.checked ? props.theme.colors.white : "inherit")};
  background-color: ${(props) =>
    props.checked ? props.theme.colors.purple : props.theme.colors.white};
  transition: background-color 100ms linear, border 100ms linear;
`;

type MultiSelectItemProps = React.ComponentProps<typeof HiddenRadio> & {
  children: React.ReactNode;
};
const ToggleButtonItem = ({ children, ...p }: MultiSelectItemProps) => (
  <StyledLabel checked={p.checked}>
    <HiddenRadio {...p} />
    {typeof children === "string" ? <span>{children}</span> : children}
  </StyledLabel>
);

const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  overflow: hidden;
  align-self: flex-start;
  border-radius: 10px;
  box-shadow: -1px 1px 2px #00000012;
  border: solid thin ${(props) => props.theme.colors.purple};
  gap: 1px;
  background-color: ${(props) => props.theme.colors.purple};
`;

type ToggleButtonGroupProps<ValueType = string | number> = React.ComponentProps<
  typeof StyledContainer
> & {
  onChange: (value: ValueType) => void;
  value: ValueType | null;
  children: {
    label: React.ReactNode;
    value: ValueType;
  }[];
};

/**
 * A styled dual button directional control component
 */
export const ToggleButtonGroup = ({
  children,
  value,
  onChange,
  ...p
}: ToggleButtonGroupProps) => {
  return (
    <StyledContainer {...p}>
      {children.map(({ label, value: itemValue }, ix) => (
        <ToggleButtonItem
          checked={value === itemValue}
          key={ix}
          onChange={(e: any) => {
            if (e.target.checked) onChange(itemValue);
          }}
        >
          {label}
        </ToggleButtonItem>
      ))}
    </StyledContainer>
  );
};

export default ToggleButtonGroup;
