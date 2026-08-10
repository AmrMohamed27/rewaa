import config from "@/payload.config";
import { getPayload as _getPayload } from "payload";
import { cache } from "react";

/**
 * Instantiates the local Payload API for server-side fetching.
 * Uses React cache to ensure the same Payload instance is used throughout a single request.
 *
 * @returns A promise that resolves to the Payload instance.
 */
export const getPayload = cache(async () => {
  return _getPayload({ config });
});
