import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { links } from "@/db/schema";

const SLUG_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function randomSlug(length = 7) {
  let slug = "";
  for (let i = 0; i < length; i++) {
    slug += SLUG_CHARS[Math.floor(Math.random() * SLUG_CHARS.length)];
  }
  return slug;
}

export async function getLinksForUser(userId: string) {
  return db
    .select()
    .from(links)
    .where(eq(links.userId, userId))
    .orderBy(desc(links.createdAt));
}

export async function getLinkBySlug(slug: string) {
  const [link] = await db.select().from(links).where(eq(links.slug, slug)).limit(1);
  return link;
}

// Retries a few times in the rare case of a random collision.
export async function generateUniqueSlug() {
  for (let attempt = 0; attempt < 5; attempt++) {
    const slug = randomSlug();
    if (!(await getLinkBySlug(slug))) return slug;
  }
  throw new Error("Failed to generate a unique slug");
}

export async function createLinkForUser(userId: string, url: string, slug: string) {
  const [link] = await db.insert(links).values({ userId, url, slug }).returning();
  return link;
}

export async function updateLinkForUser(
  userId: string,
  id: number,
  url: string,
  slug: string
) {
  const [link] = await db
    .update(links)
    .set({ url, slug })
    .where(and(eq(links.id, id), eq(links.userId, userId)))
    .returning();
  return link;
}

export async function deleteLinkForUser(userId: string, id: number) {
  const [link] = await db
    .delete(links)
    .where(and(eq(links.id, id), eq(links.userId, userId)))
    .returning();
  return link;
}
