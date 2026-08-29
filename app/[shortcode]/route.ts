import { notFound, redirect } from "next/navigation";
import { getLinkBySlug } from "@/data/links";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ shortcode: string }> }
) {
  const { shortcode } = await params;
  const link = await getLinkBySlug(shortcode);

  if (!link) {
    notFound();
  }

  redirect(link.url);
}
