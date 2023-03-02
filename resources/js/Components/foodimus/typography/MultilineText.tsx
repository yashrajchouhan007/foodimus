/**
 * This component splits a string with multiple lines to multiple divs
 */
import React from "react";

export const MultilineText = ({ children }: { children: string }) => (
  <>
    {children.split("\n").map((line, ix) => (
      <div key={ix}>{line}</div>
    ))}
  </>
);

export default MultilineText;
