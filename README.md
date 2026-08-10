# 🚀 Next.js Enterprise Starter Template

A production-ready, highly-opinionated Next.js starter template designed for speed, scalability, and developer experience. Built with the latest technologies including **Next.js 16**, **React 19**, and **Tailwind CSS v4**.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
- **Form Management**: [TanStack Form](https://tanstack.com/form) & [Zod](https://zod.dev/)
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query) & [Axios](https://axios-http.com/)
- **Theme Management**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Code Quality**: [Husky](https://typicode.github.io/husky/), [Prettier](https://prettier.io/), [ESLint](https://eslint.org/)
- **Animations**: [Tailwind Animate](https://github.com/jamiebuilds/tailwind-animate)

## ✨ Key Features

### 🔐 Pre-configured Authentication

- Core authentication logic located in `src/lib/auth.ts` and `src/hooks/useAuth.ts`.
- **Middleware-based Protection**: Route protection configured in `src/middleware.ts` to handle auth/dashboard redirects.
- **HttpOnly Cookie Support**: Axios instance pre-configured in `src/lib/api.ts` with `withCredentials: true` for secure token handling.

### 📝 Advanced Form Patterns

- **Generic Form Component**: `src/components/ui/generic-form.tsx` provides a high-level abstraction for TanStack Form, allowing you to build complex, validated forms with just a schema and field configuration.
- **Zod Integration**: Type-safe validation out of the box.

### 🚄 Optimized Data Fetching

- **Global Query Provider**: TanStack Query is set up in `src/providers/QueryProvider.tsx`.
- **Axios Interceptors**: Global request/response handling, including automatic error logging and 401 Unauthorized handling.

### 🏗️ Robust Architecture

- **Shadcn UI**: Pre-installed and configured components.
- **Typed API Layer**: Centralized API definitions in `src/lib/api.ts`.
- **Pre-commit Hooks**: Automatic linting and type-checking on every commit via Husky and lint-staged.
- **Dark Mode**: Toggleable theme support out of the box with the `ThemeToggle` component.
- **Modular Layouts**: Flexible `Navbar` and `Footer` components supporting dynamic branding (Text, SVG, or Images) and customizable navigation.

## 📂 Project Structure

```text
src/
├── app/            # App router pages, layouts, and global styles
├── components/     # React components
│   ├── layout/     # Structural components (Navbar, Footer, Logo)
│   └── ui/         # Shadcn & UI-related components (GenericForm, Button, etc.)
├── hooks/          # Custom React hooks (useAuth, etc.)
├── lib/            # Shared utilities (axios, auth types)
├── providers/      # Context providers (QueryProvider, ThemeProvider)
└── middleware.ts   # Route protection and auth logic
```

## 🚀 Getting Started

### 1. Requirements

- Node.js (Latest LTS recommended)
- PNPM (Recommended package manager)

### 2. Installation

Clone the repository and install dependencies:

```bash
pnpm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 4. Development

Start the development server:

```bash
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## 💡 Usage Example: Building a Form

To create a new form using the `GenericForm` component, follow these steps:

```tsx
"use client";

import * as z from "zod";
import { GenericForm, FieldConfig } from "@/components/ui/generic-form";
import { toast } from "sonner";

// 1. Define your schema
const schema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
});

type FormValues = z.infer<typeof schema>;

export default function MyForm() {
  // 2. Configure fields
  const fields: FieldConfig<FormValues>[] = [
    { name: "title", label: "Title", type: "text" },
    { name: "description", label: "Description", type: "textarea" },
  ];

  // 3. Handle submission
  const onSubmit = async (values: FormValues) => {
    toast.success("Form submitted!");
    console.log(values);
  };

  return (
    <GenericForm
      title="My New Form"
      schema={schema}
      defaultValues={{ title: "", description: "" }}
      fields={fields}
      onSubmit={onSubmit}
    />
  );
}
```

## 📜 Available Scripts

- `pnpm dev`: Run the development server
- `pnpm build`: Create a production build
- `pnpm start`: Start the production server
- `pnpm lint`: Run ESLint to find/fix code issues
- `pnpm type-check`: Run TypeScript compiler to check for type errors
- `pnpm prepare`: One-time setup for Husky hooks
- `pnpm docker:build`: Build the Docker image
- `pnpm docker:up`: Start the application in a Docker container
- `pnpm docker:down`: Stop the Docker container

## 🐳 Docker Support

This template is fully Dockerized for production-ready deployments and consistent local development.

### 1. Build and Run

To build and start the containerized application:

```bash
# Build the image
pnpm docker:build

# Start the container
pnpm docker:up
```

The application will be accessible at [http://localhost:3000](http://localhost:3000).

### 2. Environment Setup

The Docker container loads environment variables from the `.env` file in the root directory. Ensure you have your variables configured based on `.env.example`.

### 3. Troubleshooting

- **Build Failures**: Ensure you are using a compatible Node.js version locally if you have local lockfile issues. The Docker build uses `node:22-alpine`.
- **Port Conflicts**: If port 3000 is already in use, you can modify the mapping in `docker-compose.yml`.
- **Pnpm Versions**: The Dockerfile uses `corepack` to manage pnpm. If you encounter pnpm version mismatches, ensure your `package.json` specifies the correct `packageManager` field if needed.
- **Standalone Output**: This template uses Next.js [standalone output](https://nextjs.org/docs/app/api-reference/next-config-js/output#standalone) for optimized image size.

## 🤝 Contribution Guidelines

### Pre-commit Hooks

This project uses Husky to ensure code quality. Before every commit, the following tasks are automatically performed:

1. `eslint --fix` on staged files.
2. `prettier --write` on staged files.
3. `tsc --noEmit` to ensure type safety.

If any of these steps fail, the commit will be blocked until the issues are resolved.
