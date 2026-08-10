import { GlobalConfig } from "payload";
import { revalidateGlobalHook } from "@/payload/globals/revalidateHook";

/**
 * Payload CMS Global configuration for general Site Settings.
 * Stores core SEO data like site URL, title, and description.
 */
export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site Settings",
  admin: {
    group: "Settings",
  },
  hooks: {
    afterChange: [revalidateGlobalHook("site-settings")],
  },
  fields: [
    { name: "siteUrl", type: "text", required: true },
    { name: "siteTitle", type: "text", required: true, localized: true },
    {
      name: "siteDescription",
      type: "text",
      required: true,
      localized: true,
    },
  ],
};
