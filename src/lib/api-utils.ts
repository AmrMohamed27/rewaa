import { ApiErrorResponseDto } from "@/types/api";

interface DataType {
  data?: ApiErrorResponseDto;
  status?: number;
}

/**
 * Extracts a human-readable error message from an API response or error object.
 * Handles both Axios errors and custom API response formats.
 *
 * @param error - The error object from the mutation
 * @param data - The data object from the mutation (for cases where 200 OK but contains application-level error)
 * @returns A string containing the error message, or null if no error.
 */
export function getErrorMessage(
  error: ApiErrorResponseDto | null,
  dataObj?: unknown,
): string | null {
  if (error) {
    const message = error.message;
    if (Array.isArray(message)) {
      return message.join(", ");
    }
    return message || "An unexpected error occurred";
  }

  const data: DataType = dataObj as DataType;
  if (data?.status && data.status >= 400 && data.data) {
    if (Array.isArray(data.data.message)) {
      return data.data.message.join(", ");
    }
    return data.data.message || "An error occurred";
  }

  return null;
}
