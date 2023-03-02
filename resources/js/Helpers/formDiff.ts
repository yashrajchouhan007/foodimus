import { diff } from "just-diff";

/**
 * Serializes an object so that each value is stringified
 * @param i the input array
 * @returns a copy of the input array with each value replaced by its JSON representation
 */
const jsonValues = (i: { [s: string | number]: any }) =>
  Object.fromEntries(Object.entries(i).map(([k, v]) => [k, JSON.stringify(v)]));

/**
 * Determines if a form has been edited by the user
 * @param initialValues The initial values when the form was loaded or reset
 * @param formValues The current values
 * @returns A subset of `formValues` containing only the items that have changed
 */
const formDiff = <T>(
  initialValues: undefined | Partial<T>,
  formValues: Partial<T>
) => {
  const d = diff(jsonValues(initialValues || {}), jsonValues(formValues));
  if (!d.length) return null;
  const changes: Partial<T> = {};
  for (const {
    op,
    path: [_key],
  } of d) {
    if (op !== "replace" && op !== "add") continue;
    const key = _key as keyof T;
    const value = formValues[key];
    changes[key] = value as any;
  }
  if (Object.keys(changes).length === 0) return null;
  return changes;
};
export default formDiff;
