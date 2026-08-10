import { getPayload } from "@/lib/cms/getPayload";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { RenderBlocks } from "@/components/landing/blocks/RenderBlocks";

/**
 * Enable Incremental Static Regeneration. Pages are statically generated at build time
 * and revalidated on-demand via revalidatePath (triggered by Payload afterChange hooks),
 * or at most every 60 seconds as a fallback.
 */
export const revalidate = 60;

/**
 * Props for the dynamic page route.
 */
type Props = {
  /** The route parameters including the page slug */
  params: Promise<{
    slug: string[];
  }>;
};

/**
 * Generates static params for all pages in the 'pages' collection.
 * This enables Static Site Generation (SSG) for known routes.
 */
export async function generateStaticParams() {
  const payload = await getPayload();
  const pages = await payload.find({
    collection: "pages",
    limit: 100,
    select: {
      slug: true,
    },
  });

  // Filter out 'home' so it doesn't clash with app/page.tsx
  return pages.docs
    .filter(({ slug }) => slug !== "home")
    .map(({ slug }) => ({
      slug: slug.split("/"),
    }));
}

/**
 * Generates dynamic metadata for the page based on Payload CMS content.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;

  const slug = resolvedParams.slug?.join("/");
  const payload = await getPayload();

  const result = await payload.find({
    collection: "pages",
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  const page = result.docs[0];

  if (!page) {
    return {};
  }

  return {
    title: `${page.title} | TASTO`,
    description: `View ${page.title} on TASTO.`,
  };
}

/**
 * Dynamic route component that fetches and displays a page by its slug from Payload CMS.
 */
export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug?.join("/") || "home";

  const payload = await getPayload();

  const result = await payload.find({
    collection: "pages",
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  const page = result.docs[0];

  if (!page) {
    return notFound();
  }

  return (
    <main className="min-h-screen">
      <RenderBlocks blocks={page.layout} />
    </main>
  );
}
