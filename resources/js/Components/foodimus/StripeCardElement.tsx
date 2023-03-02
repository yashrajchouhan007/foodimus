import { CardElement as InnerCardElement } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import styled, { withTheme } from "styled-components";
import { Theme } from "@/Theme";
import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";

const StyledContainer = styled.div.withConfig(hidePropsFromHtml("focused"))<{
  focused: boolean;
}>`
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.colors.purpleBorder};
  padding: 2px 10px 0;
  transition: border 100ms linear;
  ${({ focused, theme }) =>
    focused && `border: 1px solid ${theme.colors.purple};`}
`;

type Props = React.ComponentProps<typeof InnerCardElement> & {
  theme: Theme;
};
const CardElement = withTheme(({ theme, ...p }: Props) => {
  const [focused, setFocused] = useState(false);
  return (
    <StyledContainer focused={focused}>
      <InnerCardElement
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        options={{
          style: {
            base: {
              fontFamily: theme.fonts.sans,
              color: theme.colors.dark,
              lineHeight: "37px",
              "::placeholder": {
                color: theme.colors.purpleBorder,
              },
            },
          },
        }}
        {...p}
      />
    </StyledContainer>
  );
});
export default CardElement;
