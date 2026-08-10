import type { CollectionConfig } from "payload";

/**
 * Payload CMS Collection configuration for Users.
 * Enables authentication and handles user data for the admin panel.
 */
export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  auth: true,
  fields: [
    // Email and Password are added by default by auth: true
  ],
};
