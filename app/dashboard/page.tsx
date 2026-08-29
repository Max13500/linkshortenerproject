import { auth } from "@clerk/nextjs/server";
import { Link2 } from "lucide-react";
import { getLinksForUser } from "@/data/links";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateLinkDialog } from "./create-link-dialog";
import { EditLinkDialog } from "./edit-link-dialog";
import { DeleteLinkDialog } from "./delete-link-dialog";

export default async function DashboardPage() {
  const { userId } = await auth();
  const userLinks = userId ? await getLinksForUser(userId) : [];

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Your links</h1>
          <p className="mt-2 text-muted-foreground">
            {userLinks.length === 0
              ? "You haven't created any links yet."
              : `You have ${userLinks.length} link${userLinks.length === 1 ? "" : "s"}.`}
          </p>
        </div>
        <CreateLinkDialog />
      </div>

      <div className="mt-8 space-y-4">
        {userLinks.map((link) => (
          <Card key={link.id}>
            <CardHeader className="flex-row items-center gap-3 space-y-0">
              <Link2 aria-hidden="true" className="size-5 shrink-0 text-muted-foreground" />
              <CardTitle className="text-base font-medium">/{link.slug}</CardTitle>
              <div className="ml-auto flex items-center gap-1">
                <EditLinkDialog link={link} />
                <DeleteLinkDialog link={link} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="truncate text-sm text-muted-foreground">{link.url}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
