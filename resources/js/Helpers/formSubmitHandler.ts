import { FormikConfig, FormikHelpers } from "formik";
import formDiff from "./formDiff";
import { Inertia } from "@inertiajs/inertia";

type FormikHandler<T> = FormikConfig<T>["onSubmit"];

/**
 * Validates a form, submits it, and checks for any returned errors
 * @param route the route to POST the form to
 * @param initialValues the initial values of the form, from when the page was loaded
 * @returns A `Promise` that resolves once submitting is done
 */
export const formSubmitHandler: <T>(
  route: string,
  initialValues: T | undefined
) => FormikHandler<T> =
  <T>(route: string, initialValues: T | undefined) =>
  async (
    values: T,
    {
      setSubmitting,
      resetForm,
      setFieldTouched,
      setFieldError,
    }: FormikHelpers<T>
  ) => {
    // make sure each field is marked as touched, so errors will show up
    for (const k of Object.keys(values)) {
      setFieldTouched(k, true, false);
    }
    // find out if the user has made any changes
    const changes = formDiff(initialValues || {}, values);
    if (changes === null) return;

    setSubmitting(true);
    try {
      // POST only the changes to the route
      await new Promise<void>((res, rej) =>
        Inertia.post(route, changes, {
          onFinish: res,
          onError: rej,
          preserveScroll: true,
        })
      );
      // The page props will probably update with the new values,
      // reset the form to its 'new' initial values
      resetForm();
    } catch (e) {
      if (typeof e === "object" && e !== null) {
        // Something went wrong while posting the changes,
        // The backend has probably found some validation issues
        for (const [k, err] of Object.entries(e)) {
          setFieldTouched(k, true, false);
          setFieldError(k, err);
        }

        // Scroll the first error into view
        const first = Object.keys(e)[0];
        if (first) {
          document.getElementsByName(first)?.[0]?.scrollIntoView({
            behavior: "smooth",
          });
        }
      }
    }
  };

export default formSubmitHandler;
