"use client";

import { useState, useEffect } from "react";
import { PlatformInfo } from "@/types/settings";
import { getStoredPlatformInfo } from "@/lib/settings-storage";
import { CommunicationGroup } from "./communication-group";
import { WhoWeAreGroup } from "./who-we-are-group";
import { TermsGroup } from "./terms-group";

export function PlatformInfoTab() {
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo | null>(null);

  useEffect(() => {
    const handleLoad = () => {
      setPlatformInfo(getStoredPlatformInfo());
    };
    handleLoad();

    window.addEventListener("rewaa_platform_info_updated", handleLoad);
    return () => window.removeEventListener("rewaa_platform_info_updated", handleLoad);
  }, []);

  if (!platformInfo) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* 1. Phone numbers and Communication channels */}
      <CommunicationGroup data={platformInfo.communication} />

      {/* 2. Who we are */}
      <WhoWeAreGroup data={platformInfo.whoWeAre} />

      {/* 3. Terms and conditions */}
      <TermsGroup data={platformInfo.terms} />
    </div>
  );
}
