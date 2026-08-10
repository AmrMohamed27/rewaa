declare module "*.mdx" {
  import React from "react";
  const MDXComponent: React.ComponentType<Record<string, unknown>>;
  export default MDXComponent;

  export const pageMetadata: {
    title: string;
    description: string;
    lastUpdated: string;
    explanation: string;
  };

  export const sidebarItems: Array<{
    id: string;
    title: string;
  }>;
}
