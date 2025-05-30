import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { db, schema } from "@/utils/db";
import { eq, and } from "drizzle-orm";
import { getCurrentUser } from "@/utils/jwt";


export async function POST(
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

  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json(
      { error: "Invalid Content-Type" },
      { status: 400 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet);

  const fields = await db.query.formField.findMany({
    where: eq(schema.formField.formId, formId),
  });

  const fieldMap = new Map(fields.map((f) => [f.name, f.id]));

  for (const row of jsonData) {
    const values = Object.entries(row as Record<string, unknown>).filter(
      ([key]) => key !== "S/N"
    );

    const submissionId = crypto.randomUUID();

    for (const [fieldName, value] of values) {
      const fieldId = fieldMap.get(fieldName);
      if (!fieldId) continue;

      await db.insert(schema.formSubmissionFieldValue).values({
        id: crypto.randomUUID(),
        submissionId,
        fieldId,
        value: Array.isArray(value)
          ? value.map(String)
          : [typeof value === "string" ? value : JSON.stringify(value)],
      });
    }
  }

  return NextResponse.json({ message: "Import successful" });
}
