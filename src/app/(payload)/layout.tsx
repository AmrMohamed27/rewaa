import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
import React from "react";
import { importMap } from "@/app/(payload)/admin/importMap";
// import "@/app/globals.css";
import configPromise from "../../payload.config";
import { ServerFunctionClientArgs } from "payload";
import "@payloadcms/next/css";

/**
 * Props for the Payload Admin layout.
 */
type Args = {
  /** The children components to be rendered within the layout */
  children: React.ReactNode;
};

/**
 * Server function handler for Payload CMS admin operations.
 *
 * @param args - The arguments passed from the client-side server function call.
 * @returns The result of the server function execution.
 */
async function payloadServerFunction(args: ServerFunctionClientArgs) {
  "use server";

  return handleServerFunctions({
    ...args,
    config: configPromise,
    importMap,
  });
}

/**
 * The root layout component for the Payload Admin panel.
 * Wraps the admin interface with necessary providers and configuration.
 */
const Layout = ({ children }: Args) => (
  <RootLayout config={configPromise} serverFunction={payloadServerFunction} importMap={importMap}>
    {children}
  </RootLayout>
);

export default Layout;
