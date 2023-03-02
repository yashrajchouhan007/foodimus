import { Theme } from "@/Theme";

const baseFormControlStyle = ({
  noFill,
  disabled,
  invalid,
  theme,
}: {
  noFill?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  theme: Theme;
}) => `
font-family: ${theme.fonts.control};
transition: border 100ms linear;
&:focus {
  border-color: ${theme.colors.purple};
}
  ${
    !noFill &&
    `background-color: ${theme.colors[disabled ? "backgroundD5" : "white"]};`
  }
    border: 1px solid
      ${invalid ? theme.colors.red : theme.colors.purpleBorder};
  
  ${
    !noFill && disabled
      ? `color: ${theme.colors.backgroundD40};`
      : "color: inherit;"
  }
  `;

export default baseFormControlStyle;
