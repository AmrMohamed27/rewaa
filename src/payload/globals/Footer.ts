import { revalidateGlobalHook } from "@/payload/globals/revalidateHook";
import { GlobalConfig } from "payload";

/**
 * Payload CMS Global configuration for the site Footer.
 * Defines branding, social links, navigation columns, and bottom bar links.
 */
export const Footer: GlobalConfig = {
  slug: "footer",
  label: "Footer",
  admin: {
    group: "Global",
  },
  hooks: {
    afterChange: [revalidateGlobalHook("footer")],
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
      name: "description",
      type: "textarea",
      localized: true,
    },
    {
      name: "socialLinks",
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
        {
          name: "iconSvg",
          type: "textarea",
          required: true,
          admin: {
            description: "Paste your social icon SVG code here.",
          },
        },
      ],
    },
    {
      name: "columns",
      type: "array",
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
          localized: true,
        },
        {
          name: "links",
          type: "array",
          fields: [
            {
              name: "label",
              type: "text",
              required: true,
            },
            {
              name: "link",
              type: "text",
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: "bottomLinks",
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
        {
          name: "iconSvg",
          type: "textarea",
          admin: {
            description:
              "Optional SVG code for the link. If provided, this will be shown instead of the label.",
          },
        },
      ],
    },
  ],
};
