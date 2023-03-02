import { StyledConfig } from "styled-components";
/**
 * By default, StyledComponent passes some the properties through to
 * generated HTML. This helper reduces the amount of boilerplate required
 * to hide these. Usage example:
 * ```
 * styled.div.withConfig(hidePropsFromHtml("width"))`
 *   max-width: ${({width})=>width}px;
 * `
 * ```
 * @param hide a list of key names that need to be hidden
 * @returns a config for a styled component
 */
export const hideProps = <T extends object>(...hide: string[]) => {
  return {
    shouldForwardProp: (prop: string) => !hide.includes(prop),
  } as StyledConfig<T>;
};
export const hidePropsFromHtml = <T extends object>(...hide: string[]) => {
  return {
    shouldForwardProp: (prop: string, defaultValidatorFn: any) =>
      !hide.includes(prop) && defaultValidatorFn(prop as any),
  } as StyledConfig<T>;
};
