import { GlobalConfig } from "payload";
import { revalidateGlobalHook } from "@/payload/globals/revalidateHook";

/**
 * Payload CMS Global configuration for the site Header.
 * Defines branding, navigation links, and the primary action button.
 */
export const Header: GlobalConfig = {
  slug: "header",
  label: "Header",
  admin: {
    group: "Global",
  },
  hooks: {
    afterChange: [revalidateGlobalHook("header")],
  },
  fields: [
    {
      name: "brandName",
      type: "text",
      required: true,
      defaultValue: "Rewaa",
      localized: true,
    },
    {
      name: "logoSvg",
      type: "textarea",
      admin: {
        description:
          "Paste your SVG code here. Use currentColor for fill/stroke to support theme colors.",
      },
    },
    {
      name: "navItems",
      type: "array",
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
          localized: true,
        },
        {
          name: "link",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "actionButton",
      type: "group",
      fields: [
        {
          name: "label",
          type: "text",
          defaultValue: "Sign In",
          localized: true,
        },
        {
          name: "link",
          type: "text",
          defaultValue: "/auth/login",
        },
        {
          name: "isEnabled",
          type: "checkbox",
          defaultValue: true,
        },
      ],
    },
  ],
};
