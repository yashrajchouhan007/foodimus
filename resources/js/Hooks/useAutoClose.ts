import { useEffect, useState } from "react";

/**
 * A state hook that, when set to `true`, will be reset to `false` in response to a click
 * anywhere on the page
 */
export const useAutoClose = () => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    // When the popup is shown, a click anywhere should close it again
    const handler = () => {
      setOpen(false);
    };
    window.addEventListener("click", handler);
    return () => {
      window.removeEventListener("click", handler);
    };
  }, [open]);
  return [open, setOpen] as [boolean, (value: boolean) => void];
};

export default useAutoClose;
