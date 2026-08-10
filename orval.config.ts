import { defineConfig } from "orval";
import dotenv from "dotenv";

dotenv.config();

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_HOST = new URL(API_URL).host;

export default defineConfig({
  apiReactQuery: {
    input: {
      target: `${API_URL}/api/openapi.json`,
      parserOptions: {
        headers: [
          {
            domains: [API_HOST],
            headers: {
              "x-api-key": process.env.OPENAPI_API_KEY!,
            },
          },
        ],
      },
    },
    output: {
      mode: "tags-split",
      target: "./src/lib/api/react-query/index.ts",
      schemas: "./src/types/api",
      client: "react-query",
      httpClient: "axios",
      clean: true,
      baseUrl: API_URL,
      override: {
        mutator: {
          path: "./src/lib/apiClient.ts",
          name: "api",
        },
      },
    },
  },

  apiClient: {
    input: {
      target: `${API_URL}/api/openapi.json`,
      parserOptions: {
        headers: [
          {
            domains: [API_HOST],
            headers: {
              "x-api-key": process.env.OPENAPI_API_KEY!,
            },
          },
        ],
      },
    },
    output: {
      mode: "tags-split",
      target: "./src/lib/api/client/index.ts",
      schemas: "./src/types/api",
      client: "axios",
      clean: true,
      baseUrl: API_URL,
      override: {
        mutator: {
          path: "./src/lib/apiClient.ts",
          name: "api",
        },
      },
    },
  },
});
