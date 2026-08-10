import { RootPage, generatePageMetadata } from "@payloadcms/next/views";
import configPromise from "../../../../payload.config";
import { Metadata } from "next";
import { importMap } from "@/app/(payload)/admin/importMap";

type Args = {
  params: Promise<{
    segments: string[];
  }>;
  searchParams: Promise<{
    [key: string]: string | string[];
  }>;
};

export const generateMetadata = async ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config: configPromise, params, searchParams });

const Page = async ({ params, searchParams }: Args) =>
  RootPage({ config: configPromise, params, searchParams, importMap });

export default Page;
