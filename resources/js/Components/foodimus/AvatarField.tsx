/**
 * The input used to update the user's avatar in the settings page
 */

import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useField, FieldHookConfig } from "formik";
import FallbackAvatar from "@img/fallback-avatar.png";
import { hideProps, hidePropsFromHtml } from "@/Helpers/hideProps";
import Flash, { FlashProps } from "@/Partials/Flash";
import { v4 as uuid } from "uuid";
import { useTranslation } from "react-i18next";

const StyledContainer = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  gap: 30px;
  color: ${({ theme }) => theme.colors.purple};
  font-family: ${({ theme }) => theme.fonts.controlMedium};
`;

// The hidden input tag that lets the user select a file
const StyledInput = styled.input.attrs({
  type: "file",
})`
  position: absolute;
  display: block;
  z-index: 3;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
`;

type AvatarProps = {
  src: string;
};
// This renders the currently selected avatar
const StyledAvatar = styled.div
  .withConfig(hidePropsFromHtml("src"))
  .attrs((p: AvatarProps) => ({
    style: {
      backgroundImage: `url('${p.src}')`,
    },
  }))<AvatarProps>`
  border-radius: 999px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.white};

  background-size: cover;
  background-position: center;

  width: 95px;
  height: 95px;
  border: solid 4px ${({ theme }) => theme.colors.white};
`;

// The value of the component is either a string (when showing the saved value),
// a File (when showing a selected file) or undefined when no item is active
type Value = undefined | string | File;

// Statuses for file validation
enum FileError {
  OK,
  INVALID,
  WRONG_TYPE,
  TOO_LARGE,
}

// Validate a selected file
const validFile = (
  f?: Value,
  onError?: (e: FileError) => void
): f is File | string => {
  if (f === undefined || f === "") {
    onError?.(FileError.INVALID);
    return false;
  }
  if (typeof f === "string") {
    onError?.(FileError.OK);
    return true;
  }
  if (f.type !== "image/jpeg" && f.type !== "image/png") {
    onError?.(FileError.WRONG_TYPE);
    return false;
  }
  if (f.size > 2.3e6) {
    onError?.(FileError.TOO_LARGE);
    return false;
  }
  onError?.(FileError.OK);
  return true;
};

// Convert a value to a URL (if it isn't already one)
const asUrl = async (v?: Value, onError?: (e: FileError) => void) => {
  if (typeof v === "string") return v;
  if (!validFile(v, onError)) return null;
  const reader = new FileReader();

  return await new Promise<string>((res, rej) => {
    reader.onload = (e) =>
      e?.target?.result
        ? res(e.target.result as string)
        : rej("failed to read");
    reader.readAsDataURL(v);
  });
};

type Props = Omit<
  React.ComponentProps<typeof StyledInput>,
  "value" | "onChange"
> & {
  validate?: boolean;
  value?: Value;
  label?: React.ReactNode;
  onChange?: (value: Value | undefined) => void;
  onError?: (e: FileError) => void;
};

/**
 * A field to select an avatar
 * @param props
 * @returns
 */
export const AvatarField = ({
  value,
  label,
  onChange,
  onError,
  ...p
}: Props) => {
  const input = useRef<HTMLInputElement | null>();
  const originalValue = useRef<Value>(value);
  const [url, setUrl] = useState(null as null | string);
  useEffect(() => {
    asUrl(value, (e) => {
      if (e !== FileError.OK) {
        if (input.current) input.current.value = "";
        if (originalValue.current) onChange?.(originalValue.current);
      }
      onError?.(e);
    }).then(setUrl);
  }, [value]);
  return (
    <StyledContainer>
      <StyledAvatar src={url || FallbackAvatar} />
      {label}
      <StyledInput
        {...p}
        ref={input as any}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onChange?.(e.target.files?.[0]);
        }}
      />
    </StyledContainer>
  );
};
export default AvatarField;

type FormikProps = {
  name: string;
} & FieldHookConfig<Value>;

// This is a Formik-optimized version of this control
export const AvatarFormField = ({
  className,
  label,
  ...p
}: Props & FormikProps) => {
  const [flash, setFlash] = useState(null as null | FlashProps);
  const [{ value, onChange: _onChange, ...field }, meta, { setValue }] =
    useField<Value>(p);
  const { t } = useTranslation("common");
  return (
    <div className={className}>
      <AvatarField
        invalid={meta.touched && meta.error}
        width="100%"
        {...field}
        {...p}
        value={value || ""}
        onChange={(v) => setValue(v, true)}
        onError={(e) => {
          if (e === FileError.OK) return;
          const errMsg = {
            [FileError.INVALID]: "form.avatar.error.invalid",
            [FileError.TOO_LARGE]: "form.avatar.error.too-large",
            [FileError.WRONG_TYPE]: "form.avatar.error.wrong-type",
          }[e];
          setFlash({
            uuid: uuid(),
            error: t(errMsg, {
              max_size: "2 MB",
            }),
          });
        }}
        label={label}
      />
      <Flash className="flash" {...flash} />
      {meta.error && meta.touched && <div className="error">{meta.error}</div>}
    </div>
  );
};
