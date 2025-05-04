"use server";

import { db, schema } from "@/utils/db";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/utils/jwt";

export async function updateFormSettings(formId: string, acceptingResponses: boolean) {
  const userId = await getCurrentUser();
  console.log("Current user ID:", userId);

  const form = await db.query.form.findFirst({
    where: eq(schema.form.id, formId),
  });

  if (!form) {
    console.error("Form not found");
    throw new Error("Form not found");
  }

  if (form.userId !== userId) {
    console.error("Unauthorized access");
    throw new Error("Unauthorized");
  }

  const result = await db
    .update(schema.form)
    .set({ acceptingResponses })
    .where(eq(schema.form.id, formId));

  console.log("Update result:", result);

  const updatedForm = await db.query.form.findFirst({
    where: eq(schema.form.id, formId),
  });

  return { acceptingResponses: updatedForm?.acceptingResponses ?? false };
}
