/**
 * Hooks to access breakpoints from React, triggering
 * redraws whenever the viewport changes such that the value
 * for the hook changes
 */
import breakpoints from "@/Theme/breakpoints";
import { useMediaQuery } from "react-responsive";

type Hooks = { [s: string]: () => boolean };

const hooks = Object.fromEntries(
  // generate based on the breakpoints from the theme
  Object.entries(breakpoints).map(([breakpoint, query]) => {
    return [
      `use` + breakpoint.replace(/^./, (l) => l.toUpperCase()),
      () => useMediaQuery({ query }),
    ];
  })
) as Hooks;

// If you add or rename breakpoints, modify these exports
export const useMobile = hooks.useMobile;
export const useTablet = hooks.useTablet;
export const useLaptop = hooks.useLaptop;
export const useDesktop = hooks.useDesktop;
