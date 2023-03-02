import { SelectFormField } from "@/Components/foodimus/Select";
import { TextFormField } from "@/Components/foodimus/TextField";
import { NumberFormField } from "@/Components/foodimus/NumberField";
import styled, { css } from "styled-components";
import { Form } from "formik";
import { DateFormField } from "@/Components/foodimus/DateField";
import { PhoneFormField } from "@/Components/foodimus/PhoneField";
import { AvatarFormField } from "@/Components/foodimus/AvatarField";

export const Section = styled(Form)`
  display: flex;
  flex-direction: column;
  font-size: 16px;
  width: 300px;
  gap: 30px;
  &:not(:last-child) {
    padding-bottom: 38px;
  }
  &.full-width {
    width: 100%;
  }
`;
export const fieldStyle = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
  .error {
    color: ${({ theme }) => theme.colors.red};
    font-size: 0.8em;
    line-height: 0.9em;
  }
`;
export const StyledTextFormField = styled(TextFormField)`
  ${fieldStyle}
`;
export const StyledNumberFormField = styled(NumberFormField)`
  ${fieldStyle}
`;
export const StyledDateFormField = styled(DateFormField)`
  ${fieldStyle}
`;
export const StyledSelectFormField = styled(SelectFormField)`
  ${fieldStyle}
`;
export const StyledPhoneFormField = styled(PhoneFormField)`
  ${fieldStyle}
`;
export const StyledAvatarFormField = styled(AvatarFormField)`
  padding: 10px 0 0;
  .flash {
    margin-top: 10px;
  }
  .label {
    font-size: 16px;
    gap: 10px;
    *:not(:last-child) {
      margin-right: 0.75em;
    }
  }
  @media (hover: hover) {
    :hover {
      .label {
        text-decoration: underline;
      }
    }
  }
`;
