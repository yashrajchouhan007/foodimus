import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";
import React from "react";
import styled from "styled-components";

const HiddenRadioButton = styled.input.attrs({
  type: "radio",
})`
  display: none;
`;

const StyledLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 13px;
`;

const StyledSpanRadioButton = styled.span.withConfig<{
  checked: null | boolean;
}>(hidePropsFromHtml("checked"))`
  display: inline-block;
  position: relative;
  width: 22px;
  height: 22px;
  border: solid thin ${(props) => props.theme.colors.purple};
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.white};
  &:before {
    content: "";
    position: absolute;
    left: 2px;
    top: 2px;
    right: 2px;
    bottom: 2px;
    border-radius: 999px;
    ${(props) =>
      props.checked === true &&
      `background-color: ${props.theme.colors.purple};`}
    ${(props) =>
      props.checked === null &&
      `background-color: ${props.theme.colors.purpleA50};`}
    transition: background-color 100ms linear;
  }
  &:active:before {
    background-color: ${(props) => props.theme.colors.purpleL20};
  }
`;
const StyledSpanLabel = styled.span`
  user-select: none;
`;

type Props = React.ComponentProps<typeof HiddenRadioButton> & {
  children?: string | React.ReactNode;
  onChange?: (checked: boolean, e: React.ChangeEvent<HTMLInputElement>) => void;
  checked?: null | boolean;
  className?: string;
};

export const RadioButton = ({
  children,
  onChange,
  checked,
  className,
  ...p
}: Props) => (
  <StyledLabel className={(className || "") + (checked ? " checked" : "")}>
    <HiddenRadioButton
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onChange?.(e.target.checked, e)
      }
      checked={checked !== false}
      {...p}
    />
    <StyledSpanRadioButton checked={checked === undefined ? false : checked} />
    {!!children && (
      <StyledSpanLabel className="label">{children}</StyledSpanLabel>
    )}
  </StyledLabel>
);

export default RadioButton;
