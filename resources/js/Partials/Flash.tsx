import FlashComponent, { FlashContent } from "@/Components/foodimus/Flash";
import React from "react";

export type FlashProps = {
  message?: null | string;
  success?: null | string;
  error?: null | string;
  uuid?: string;
};
export const Flash = ({
  error,
  message,
  success,
  uuid,
  className,
  ...p
}: FlashProps & { className?: string }) => (
  <>
    {error && (
      <FlashComponent flashId={uuid} className={className}>
        <FlashContent {...p} type="error">
          {error}
        </FlashContent>
      </FlashComponent>
    )}
    {message && (
      <FlashComponent flashId={uuid} className={className}>
        <FlashContent {...p} type="message">
          {message}
        </FlashContent>
      </FlashComponent>
    )}
    {success && (
      <FlashComponent flashId={uuid} className={className}>
        <FlashContent {...p} type="success">
          {success}
        </FlashContent>
      </FlashComponent>
    )}
  </>
);

export default Flash;
