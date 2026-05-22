export const MAX_COMPARISON = 4;
export const DEBOUNCE_MS = 300;

export const MAX_RECENT_SEARCHES = 4;
export const RECENT_SEARCHES_KEY = "recent_searches";

const FALLBACK_ERROR_MESSAGE = "Something went wrong. Please try again.";

// Errors reach here from two sources: thrown Error instances and the plain
// ApiError-shaped objects ({ message }) thrown by the mock API handlers.
export function getErrorMessage(err: unknown): string {
  if (err instanceof Error && err.message) return err.message;

  if (typeof err === "string" && err) return err;

  if (
    typeof err === "object" &&
    err !== null &&
    "message" in err &&
    typeof (err as { message: unknown }).message === "string" &&
    (err as { message: string }).message
  ) {
    return (err as { message: string }).message;
  }

  return FALLBACK_ERROR_MESSAGE;
}
