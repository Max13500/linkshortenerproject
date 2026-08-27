# Authentication

## Provider

[Clerk](https://clerk.com) (`@clerk/nextjs`) is the **only** authentication provider for this app. Do not introduce NextAuth, Auth.js, custom JWT/session handling, or any other auth library or hand-rolled auth logic.

- `ClerkProvider` wraps the app in [app/layout.tsx](../app/layout.tsx).
- `clerkMiddleware()` runs in [proxy.ts](../proxy.ts) and must keep matching all app routes (excluding static assets) plus `/api`, `/trpc`, and `/__clerk` paths.

## Protected routes

`/dashboard` (and anything nested under it) requires a signed-in user.

Enforce this in `proxy.ts` using `createRouteMatcher` + `auth.protect()`:

```ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});
```

Do not rely on client-side checks alone to protect dashboard routes; the middleware guard is the source of truth.

## Home page redirect

The `/` route must redirect signed-in users to `/dashboard`. Check auth state server-side and redirect before rendering:

```tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return /* signed-out homepage content */;
}
```

## Sign in / sign up

Sign in and sign up must always be presented as **modals**, never as full-page navigations.

- Trigger auth with `SignInButton`/`SignUpButton` using `mode="modal"`:

  ```tsx
  <SignInButton mode="modal" />
  <SignUpButton mode="modal" />
  ```

- Do not link to dedicated `/sign-in` or `/sign-up` pages for normal navigation. If those catch-all routes exist for Clerk's redirect fallback, they should not be part of the primary UX flow.
- Use Clerk's `<Show when="signed-in">` / `<Show when="signed-out">` (or `SignedIn`/`SignedOut`) to switch between showing the sign-in/sign-up triggers and the `UserButton`.
