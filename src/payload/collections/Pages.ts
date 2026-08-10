import { CollectionConfig } from "payload";
import { Hero } from "../blocks/Hero";
import { revalidatePageHook } from "../globals/revalidateHook";

/**
 * Payload CMS Collection configuration for dynamic Pages.
 * Allows creating pages with custom layouts using blocks like Hero, Features, and CTA.
 */
export const Pages: CollectionConfig = {
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "updatedAt"],
  },
  slug: "pages",
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidatePageHook],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        position: "sidebar",
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value)
              return value
                .toLowerCase()
                .replace(/ /g, "-")
                .replace(/[^\w-]+/g, "");
            if (data?.title)
              return data.title
                .toLowerCase()
                .replace(/ /g, "-")
                .replace(/[^\w-]+/g, "");
            return value;
          },
        ],
      },
    },
    {
      name: "layout",
      type: "blocks",
      blocks: [Hero],
      required: true,
    },
  ],
};
