import React from "react";
import { ReactSwitchProps } from "react-switch";
import styled from "styled-components";
import Switch from "./Switch";

const StyledLabel = styled.label`
  display: flex;
  flex-direction: row;
  gap: 13px;
  align-items: center;
`;

type Props = { children: React.ReactNode } & ReactSwitchProps;
/**
 * A Switch, wrapped in a label component
 */
export const LabeledSwitch = ({ children, ...p }: Props) => (
  <StyledLabel>
    <Switch {...p} />
    <span>{children}</span>
  </StyledLabel>
);

export default LabeledSwitch;
