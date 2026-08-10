// app/page.tsx
import { getPayload } from "@/lib/cms/getPayload";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { RenderBlocks } from "@/components/landing/blocks/RenderBlocks";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload();
  const result = await payload.find({
    collection: "pages",
    where: { slug: { equals: "home" } },
  });

  const page = result.docs[0];
  if (!page) return {};

  return {
    title: `${page.title} | Rewaa`,
    description: `View ${page.title} on Rewaa.`,
  };
}

export default async function HomePage() {
  const payload = await getPayload();
  const result = await payload.find({
    collection: "pages",
    where: { slug: { equals: "home" } },
  });

  const page = result.docs[0];
  if (!page) return notFound();

  return (
    <main className="min-h-screen">
      <RenderBlocks blocks={page.layout} />
    </main>
  );
}
