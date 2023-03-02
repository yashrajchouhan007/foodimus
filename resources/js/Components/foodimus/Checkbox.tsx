import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";
import React from "react";
import styled from "styled-components";

const HiddenCheckbox = styled.input.attrs({
  type: "checkbox",
})`
  display: none;
`;

const StyledLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 13px;
`;

const StyledSpanCheckbox = styled.span.withConfig(
  hidePropsFromHtml("checked")
)<{
  checked: null | boolean;
}>`
  display: inline-block;
  position: relative;
  width: 22px;
  height: 22px;
  border: solid thin ${(props) => props.theme.colors.purple};
  border-radius: 5px;
  background: ${({ theme }) => theme.colors.white};
  &:before {
    content: "";
    position: absolute;
    left: 2px;
    top: 2px;
    right: 2px;
    bottom: 2px;
    border-radius: 3px;
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

type Props = React.ComponentProps<typeof HiddenCheckbox> & {
  children?: string | React.ReactNode;
  onChange?: (checked: boolean, e: React.ChangeEvent<HTMLInputElement>) => void;
  checked?: null | boolean;
  className?: string;
};

export const Checkbox = ({
  children,
  onChange,
  checked,
  className,
  ...p
}: Props) => (
  <StyledLabel className={(className || "") + (checked ? " checked" : "")}>
    <HiddenCheckbox
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onChange?.(e.target.checked, e)
      }
      checked={checked !== false}
      {...p}
    />
    <StyledSpanCheckbox checked={checked === undefined ? false : checked} />
    {!!children && (
      <StyledSpanLabel className="label">{children}</StyledSpanLabel>
    )}
  </StyledLabel>
);

export default Checkbox;
