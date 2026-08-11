import React from "react";
import type { Metadata } from "next";
import { LegalHero } from "../components/LegalHero";
import { LegalContent } from "../components/LegalContent";
import PrivacyContent, { pageMetadata, sidebarItems } from "./privacy.mdx";

export const metadata: Metadata = {
  title: pageMetadata.title,
  description: pageMetadata.description,
};

export default function PrivacyPolicyPage() {
  return (
    <div>
      <LegalHero title="Privacy Policy" explanation={pageMetadata.explanation} />

      <LegalContent sidebarItems={sidebarItems}>
        <PrivacyContent />
      </LegalContent>
    </div>
  );
}
