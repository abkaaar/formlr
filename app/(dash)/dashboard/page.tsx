import { makeForm, deleteForm } from "@/actions/save-form";
import Header from "@/components/header";
import { Search } from "@/components/search.client";
import { Card } from "@/components/ui/card";
import { db, schema } from "@/utils/db";
import { getCurrentUser } from "@/utils/jwt";
import { and, asc, desc, eq, ilike } from "drizzle-orm";
import { Dot, EllipsisVertical, PlusIcon, Trash } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { IsLoading } from "./components.client";
import type { Metadata } from "next";

export const metadata = {
  title: "Dashboard",
  description: "Start new forms and view recent forms.",
  robots: {
    index: false,
    follow: false,
  },
} satisfies Metadata;



export default function Dashboard({
  searchParams,
}: {
  searchParams: { q?: string };
}) {

  
  return (
    <div className="min-h-screen bg-background" vaul-drawer-wrapper="">
      <Header>
        <Search />
      </Header>

      <div className="container pt-5 flex flex-col gap-6 mb-5">
        <div>
          <h1 className="text-2xl font-bold my-2">Start new survey</h1>
          <form className="flex flex-row overflow-auto gap-5" action={makeForm}>
            <div className="h-auto flex-col">
              <button
                type="submit"
                className="m-0.5 w-40 h-28 border rounded-lg flex items-center justify-center hover:bg-secondary/50 bg-card text-card-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <IsLoading className="text-[#3B82F6] w-14 h-14">
                  <PlusIcon className="text-[#3B82F6] w-14 h-14" />
                </IsLoading>
              </button>
              <p className="p-1.5 select-none">Blank survey</p>
            </div>
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-bold my-2">Recent surveys</h2>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 transition-all">
            <Suspense fallback={<LoadingFormsList />} key={searchParams.q}>
              <FormsList search={searchParams.q} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

async function FormsList({ search }: { search?: string }) {
  const userId = await getCurrentUser();

  const forms = await db.query.form.findMany({
    where: search
      ? and(
          eq(schema.form.userId, userId!),
          ilike(schema.form.name, `%${search}%`)
        )
      : eq(schema.form.userId, userId!),
    orderBy: desc(schema.form.lastModified),
  });

  return forms.map((form) => (
    <div key={form.id}>
      <Link
        href={`/editor/${form.id}`}
        className="hover:bg-secondary dark:hover:bg-secondary/50 flex ring-offset-background rounded-lg border bg-card text-card-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Card className="w-full border-none hover:bg-secondary dark:hover:bg-secondary/50 p-6 gap-2 flex flex-col">
          <div className="flex flex-row items-center justify-between">
            <h3>{form.name}</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {form.lastModified?.toLocaleDateString()}
          </p>
        </Card>
      </Link>
      <form className="flex flex-row overflow-auto gap-5" action={deleteForm}>
      <input type="hidden" name="formId" value={form.id} />
        <div className="h-auto flex-col">
          <button type="submit" className="">
            <IsLoading className="text-destructive w-4 h-4">
            <Trash className="w-4 h-4 text-destructive hover:text-destructive/80" />
            </IsLoading>
          </button>
        </div>
      </form>
    </div>
  ));
}

function LoadingFormsList() {
  return new Array(10).fill(null).map((_, i) => (
    <Card key={i} className="w-full gap-2 flex flex-col p-6">
      <span className="h-6 w-full bg-secondary/50 rounded-lg animate-pulse" />
      <span className="h-5 w-full bg-secondary/50 rounded-lg animate-pulse" />
    </Card>
  ));
}
