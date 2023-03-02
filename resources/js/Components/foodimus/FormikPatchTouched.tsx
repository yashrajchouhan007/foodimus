/**
 * By adding this control to a Formik form, all fields are marked as
 * touched whenever you post them, so the error messages are shown
 */

import { useFormikContext } from "formik";
import { useEffect } from "react";
export const FormikPatchTouched = () => {
  const { errors, setFieldTouched, isSubmitting, isValidating } =
    useFormikContext();
  useEffect(() => {
    if (isSubmitting && !isValidating) {
      for (const path of Object.keys(errors)) {
        setFieldTouched(path, true, false);
      }
    }
  }, [errors, isSubmitting, isValidating, setFieldTouched]);
  return null;
};
