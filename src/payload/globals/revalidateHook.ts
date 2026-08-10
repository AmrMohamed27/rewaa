import { CollectionAfterChangeHook, GlobalAfterChangeHook } from "payload";
import { revalidatePath } from "next/cache";

/**
 * Returns a Payload global afterChange hook that revalidates the Next.js cache.
 * Uses revalidatePath to purge the full-route cache for all pages that use this global
 * (layout-level data like header/footer affects every page).
 *
 * @param globalSlug - The slug of the global being revalidated.
 * @returns A Payload GlobalAfterChangeHook function.
 */
export const revalidateGlobalHook = (globalSlug: string): GlobalAfterChangeHook => {
  return async ({ doc, req }) => {
    if (process.env.SEEDING === "true") {
      return doc;
    }

    try {
      // Globals like header/footer are used across all pages via the layout,
      // so we revalidate the entire site layout.
      revalidatePath("/", "layout");
      req.payload.logger.info(`Successfully revalidated layout for global "${globalSlug}"`);
    } catch (err) {
      req.payload.logger.error(`Error revalidating global "${globalSlug}": ${err}`);
    }
    return doc;
  };
};

/**
 * Payload collection afterChange hook that revalidates the specific page path
 * when a page document is created or updated.
 */
export const revalidatePageHook: CollectionAfterChangeHook = async ({ doc, req }) => {
  if (process.env.SEEDING === "true") {
    return doc;
  }

  try {
    const slug = doc.slug as string;
    const pagePath = slug === "home" ? "/" : `/${slug}`;

    revalidatePath(pagePath);
    req.payload.logger.info(`Successfully revalidated path "${pagePath}" for page "${doc.title}"`);
  } catch (err) {
    req.payload.logger.error(`Error revalidating page "${doc.title}": ${err}`);
  }
  return doc;
};

/** @deprecated Use revalidateGlobalHook instead */
export const revalidateHook = revalidateGlobalHook;
