import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { db, schema } from "@/utils/db";
import { eq, asc } from "drizzle-orm";
import { getCurrentUser } from "@/utils/jwt";
import { Readable } from "stream";

export async function GET(
  req: Request,
  { params }: { params: { formId: string } }
) {
  const userId = await getCurrentUser();
  const formId = params.formId;

  const form = await db.query.form.findFirst({
    where: eq(schema.form.id, formId),
  });

  if (!form || form.userId !== userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const fields = await db.query.formField.findMany({
    where: eq(schema.formField.formId, formId),
    orderBy: asc(schema.formField.index),
  });

  const allResponses = await Promise.all(
    fields.map(async (field) => {
      const responses = await db.query.formSubmissionFieldValue.findMany({
        where: eq(schema.formSubmissionFieldValue.fieldId, field.id),
        columns: { value: true },
      });

      return {
        fieldName: field.name || "Unnamed Field",
        responses: responses.map((r) => r.value),
      };
    })
  );

  const maxLength = Math.max(...allResponses.map((r) => r.responses.length));
  const rows = Array.from({ length: maxLength }, (_, rowIndex) => {
    const row: Record<string, any> = { "S/N": rowIndex + 1 };
    allResponses.forEach(({ fieldName, responses }) => {
      let val:any = responses[rowIndex];
      if (Array.isArray(val)) val = val.join(", ");
      if (typeof val === "boolean") val = [val ? "Yes" : "No"];
      row[fieldName] = val ?? "No response";
    });
    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Responses");

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  return new Response(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${form.name}.xlsx"`,
    },
  });
}
