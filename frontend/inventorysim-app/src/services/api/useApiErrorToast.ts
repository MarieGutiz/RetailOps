import { useEffect, useRef } from "react";
// import toast from "react-hot-toast";
import {toast} from "sonner";
/**
 * Automatically shows a toast for ApiError
 * @param error any error object thrown from API calls
 * @param context optional description or context for the toast
 */
export function useApiErrorToast(
  error: unknown,
  context?: string
) {
  const shownRef = useRef(false);

  useEffect(() => {
    // Reset when error changes
    shownRef.current = false;

    if (!error) return;

    let message = "Unexpected error";

    if (typeof error === "string") {
      message = error;
    } else if (error instanceof Error) {
      message = error.message;
    } else if (
      typeof error === "object" &&
      error !== null &&
      "message" in error
    ) {
      message = String((error as any).message);
    }

    toast.error(
      context ? `${context}: ${message}` : message
    );

    shownRef.current = true;
  }, [error, context]);
}

