import React from "react";
import type { Metadata } from "next";
import { LegalHero } from "../components/LegalHero";
import { LegalContent } from "../components/LegalContent";
import TermsContent, { pageMetadata, sidebarItems } from "./terms.mdx";

export const metadata: Metadata = {
  title: pageMetadata.title,
  description: pageMetadata.description,
};

export default function TermsOfServicePage() {
  return (
    <div>
      <LegalHero title="Terms of Service" explanation={pageMetadata.explanation} />

      <LegalContent sidebarItems={sidebarItems}>
        <TermsContent />
      </LegalContent>
    </div>
  );
}
