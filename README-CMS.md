# Payload CMS Guide

This guide provides instructions on how to interact with Payload CMS within this project.

## 1. Local API vs HTTP API

### Local API (Recommended for Server-Side)

The Local API is the fastest way to interact with Payload as it bypasses the network layer. It should be used in **Server Components**, **Server Actions**, and **Seed Scripts**.

```typescript
import { getPayload } from "payload";
import config from "@/payload.config";

const payload = await getPayload({ config });

// Example: Fetching pages
const pages = await payload.find({
  collection: "pages",
});
```

### HTTP API (REST / GraphQL)

The HTTP API is available for client-side fetching (though Server Components are preferred) or external integrations.

- **REST API**: `GET http://localhost:3000/api/pages`
- **GraphQL API**: `POST http://localhost:3000/api/graphql`

---

## 2. Creating and Registering a New Block

To add a new section to your pages, follow these steps:

1. **Create the Block Definition**:
   Create a new file in `src/payload/blocks/MyNewBlock.ts`.

   ```typescript
   import { Block } from "payload";

   export const MyNewBlock: Block = {
     slug: "my-new-block",
     fields: [
       {
         name: "title",
         type: "text",
         required: true,
       },
     ],
   };
   ```

2. **Register the Block in Config**:
   Open `src/payload.config.ts` and add it to the `blocks` array.

   ```typescript
   import { MyNewBlock } from "./payload/blocks/MyNewBlock";

   export default buildConfig({
     // ...
     blocks: [Hero, Features, CTA, MyNewBlock],
   });
   ```

3. **Add to Collection**:
   Update `src/payload/collections/Pages.ts` to include the block in the `layout` field.

   ```typescript
   {
     name: 'layout',
     type: 'blocks',
     blocks: [Hero, Features, CTA, MyNewBlock],
   }
   ```

---

## 3. Querying Data in Next.js Server Components

You can fetch data directly within your Next.js pages or components using the Local API.

### Example: Fetching a Page by Slug

```typescript
import { getPayload } from 'payload'
import config from '@/payload.config'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: { slug: string } }) {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: params.slug || 'home',
      },
    },
  })

  const page = result.docs[0]

  if (!page) {
    return notFound()
  }

  return (
    <main>
      <h1>{page.title}</h1>
      {/* Render blocks here */}
    </main>
  )
}
```

## 4. Seeding the Database

To populate the database with sample content (Home page, Hero, Features, CTA, and Blog posts), run:

```bash
npm run seed
```

This will:

- Create an admin user (`admin@example.com` / `password`).
- Upload a sample hero image.
- Create a "Home" page with populated blocks.
- Create sample blog posts.
