# Data Mutations

## Server actions only

All data mutations (create/update/delete) must be done via Next.js **server actions**. Do not mutate data from API routes, route handlers, or directly inside server components.

- Server actions are called from **client components** (e.g. on form submit or button click).
- Server action files **must** be named `actions.ts` and colocated in the same directory as the client component that calls them.

  ```
  app/dashboard/
    page.tsx
    link-form.tsx      # client component
    actions.ts         # server actions used by link-form.tsx
  ```

## Typed inputs

Server actions must accept plain, explicitly typed arguments — never `FormData`.

```ts
"use server";

type CreateLinkInput = {
  url: string;
  slug: string;
};

export async function createLink(input: CreateLinkInput) {
  // ...
}
```

Client components should build the typed object (e.g. from form state) and pass it directly to the action, instead of passing a `FormData` object.

## Validation with zod

Every server action must validate its input with [zod](https://zod.dev) before doing anything else. Reject/throw on invalid input rather than passing unchecked data further into the action.

```ts
"use server";
import { z } from "zod";

const createLinkSchema = z.object({
  url: z.string().url(),
  slug: z.string().min(1),
});

export async function createLink(input: CreateLinkInput) {
  const data = createLinkSchema.parse(input);
  // ...
}
```

## Auth check first

Every server action must check for a signed-in user via Clerk's `auth()` **before** any other logic (including validation order is up to you, but no database operation may run without this check). Return/throw early if there is no authenticated user.

```ts
"use server";
import { auth } from "@clerk/nextjs/server";

export async function createLink(input: CreateLinkInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const data = createLinkSchema.parse(input);
  // ...
}
```

## Database access via `/data` helpers

Server actions must **not** call Drizzle queries directly. All database operations go through helper functions in [data](../data), which wrap the Drizzle queries.

```ts
// data/links.ts
import { db } from "@/db";
import { links } from "@/db/schema";

export async function createLinkForUser(userId: string, url: string, slug: string) {
  return db.insert(links).values({ userId, url, slug });
}
```

```ts
// app/dashboard/actions.ts
"use server";
import { auth } from "@clerk/nextjs/server";
import { createLinkForUser } from "@/data/links";

export async function createLink(input: CreateLinkInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const data = createLinkSchema.parse(input);
  return createLinkForUser(userId, data.url, data.slug);
}
```

Putting it together, the required order inside a server action is:

1. Check for a signed-in user (`auth()`).
2. Validate the input with zod.
3. Call a `/data` helper function to perform the database operation.
