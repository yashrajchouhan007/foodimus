/**
 * This module contains the different types of buttons
 */

import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";
import { ThemeColor } from "@/Theme";
import { Inertia } from "@inertiajs/inertia";
import React from "react";
import styled from "styled-components";

const hoverColor = (baseColor: string) => `${baseColor}L20`;
const activeColor = (baseColor: string) => `${baseColor}L10`;
const disabledColor = (baseColor: string) => `${baseColor}S40`;

type UnstyledButtonProps = {
  size?: "sm" | "md" | "lg";
};
const UnstyledButton = styled.button.withConfig(
  hidePropsFromHtml("size")
)<UnstyledButtonProps>`
  font-size: ${({ size }) =>
    size === "lg" ? `24px` : size === "md" ? `20px` : `16px`};
`;

const BaseButton = styled(UnstyledButton)`
  font-family: ${(props) => props.theme.fonts.controlMedium};
  text-align: center;
  user-select: none;
`;

export const GhostButton = styled(BaseButton)`
  transition: opacity 100ms linear;
  @media (hover: hover) {
    &:hover {
      opacity: 0.8;
    }
  }
  &:active {
    opacity: 0.6;
  }
  &:disabled,
  &[disabled] {
    opacity: 0.5;
  }
`;

// Basic styling for the button
type ButtonProps = UnstyledButtonProps & {
  color?: ThemeColor;
  hoverColor?: ThemeColor;
  activeColor?: ThemeColor;
  disabledColor?: ThemeColor;
};
export const Button = styled(BaseButton).withConfig(
  hideProps("color", "hoverColor", "activeColor", "disabledColor")
)<ButtonProps>`
  ${({ onClick, type }) => type !== "submit" && !onClick && `cursor: default;`}
  padding: 16px 20px 14px;
  border-radius: 9999px;
  min-width: 100px;
  line-height: 16px;
  color: ${(props) => props.theme.colors.white};

  background-color: ${(props) => props.theme.colors[props.color || "purple"]};
  transition: background-color 100ms linear;
  @media (hover: hover) {
    &:hover {
      background-color: ${(props) =>
        props.theme.colors[
          props.hoverColor || hoverColor(props.color || "purple")
        ]};
    }
  }
  &:active {
    background-color: ${(props) =>
      props.theme.colors[
        props.activeColor || activeColor(props.color || "purple")
      ]};
  }
  &:disabled,
  &[disabled] {
    opacity: 0.8;
    color: ${(props) => props.theme.colors.lightGrey};
    background-color: ${(props) =>
      props.theme.colors[
        props.disabledColor || disabledColor(props.color || "purple")
      ]};
  }
`;

type LinkButtonProps = React.ComponentProps<typeof Button> & {
  href?: string;
  external?: boolean;
  blank?: boolean;
  variant?: "normal" | "ghost" | "nostyle";
};

export const LinkButton = ({
  href,
  external,
  blank,
  variant,
  ...p
}: LinkButtonProps) => {
  const onClick =
    href &&
    (external
      ? () => {
          if (blank !== null) {
            window.open(href, "_blank");
          } else {
            window.location.assign(href);
          }
        }
      : () => {
          Inertia.get(href);
        });

  const ButtonType =
    variant === "nostyle"
      ? UnstyledButton
      : variant === "ghost"
      ? GhostButton
      : Button;
  return <ButtonType onClick={onClick} {...p} />;
};

export default Button;
