/* This file is responsible for handling GraphQL requests */
import config from "@/payload.config";
import { GRAPHQL_POST } from "@payloadcms/next/routes";

export const POST = async (req: Request) => GRAPHQL_POST(config)(req);
