"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  createLinkForUser,
  deleteLinkForUser,
  generateUniqueSlug,
  getLinkBySlug,
  updateLinkForUser,
} from "@/data/links";

type CreateLinkInput = {
  url: string;
  slug?: string;
};

const createLinkSchema = z.object({
  url: z.string().trim().url("Enter a valid URL."),
  slug: z
    .string()
    .trim()
    .min(3, "Slug must be at least 3 characters.")
    .max(32, "Slug must be at most 32 characters.")
    .regex(/^[a-zA-Z0-9-_]+$/, "Slug can only contain letters, numbers, hyphens, and underscores.")
    .optional(),
});

export async function createLink(input: CreateLinkInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const data = createLinkSchema.parse(input);

  const slug = data.slug ? data.slug : await generateUniqueSlug();
  if (data.slug && (await getLinkBySlug(slug))) {
    throw new Error("That slug is already taken.");
  }

  await createLinkForUser(userId, data.url, slug);
  revalidatePath("/dashboard");
}

type UpdateLinkInput = {
  id: number;
  url: string;
  slug: string;
};

const updateLinkSchema = z.object({
  id: z.number().int().positive(),
  url: z.string().trim().url("Enter a valid URL."),
  slug: z
    .string()
    .trim()
    .min(3, "Slug must be at least 3 characters.")
    .max(32, "Slug must be at most 32 characters.")
    .regex(/^[a-zA-Z0-9-_]+$/, "Slug can only contain letters, numbers, hyphens, and underscores."),
});

export async function updateLink(input: UpdateLinkInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const data = updateLinkSchema.parse(input);

  const existing = await getLinkBySlug(data.slug);
  if (existing && existing.id !== data.id) {
    throw new Error("That slug is already taken.");
  }

  const updated = await updateLinkForUser(userId, data.id, data.url, data.slug);
  if (!updated) throw new Error("Link not found.");
  revalidatePath("/dashboard");
}

type DeleteLinkInput = {
  id: number;
};

const deleteLinkSchema = z.object({
  id: z.number().int().positive(),
});

export async function deleteLink(input: DeleteLinkInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const data = deleteLinkSchema.parse(input);

  const deleted = await deleteLinkForUser(userId, data.id);
  if (!deleted) throw new Error("Link not found.");
  revalidatePath("/dashboard");
}
