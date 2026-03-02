import  { useCallback } from "react";

export const useFormats = () => {
  /**
   * Capitalize the first letter of a string
   */
const capitalizeFirst = useCallback((s: unknown) => {
  if (!s) return "";
  const str = String(s); // convert anything to string
  return str.charAt(0).toUpperCase() + str.slice(1);
}, []);

  /**
   * Format a date string, e.g., "Mar 2, 2026, 3:45 PM"
   */
  const formatDate = useCallback((dateInput: string | Date) => {
    if (!dateInput) return "-";
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }, []);

  return {
    capitalizeFirst,
    formatDate,
  };
};