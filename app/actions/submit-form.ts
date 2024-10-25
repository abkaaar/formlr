"use server";

import { db, schema } from "@/utils/db";
import { getCurrentUser } from "@/utils/jwt";
import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import fs from "fs/promises";
import { z } from "zod";
import { uploadFile } from "@/api/upload";

export async function submitForm(
  prevState: any,
  data: FormData
): Promise<{ error?: string } | void> {
  const formId = data?.get("formId") as string | undefined;
  if (!formId) return { error: "Form not found" };

  const form = await db.query.form.findFirst({
    where: eq(schema.form.id, formId),
    columns: {
      id: true,
    },
    with: {
      fields: {
        columns: {
          id: true,
          type: true,
          required: true,
          options: true,
          otherOption: true,
          optionsStyle: true,
          textSize: true,
          name: true,
        },
      },
    },
  });

  if (!form) {
    return {
      error: "Form not found",
    };
  }

  const fieldsData = new Map<string, string[]>();

  for (const field of form.fields) {
    if (field.type === "choice") {
      // if checkbox get all values
      if (field.optionsStyle === "checkbox") {
        const values = data.getAll(field.id) as string[] | undefined;
        if (field.required && values?.length === 0) {
          return { error: `Field ${field.name} is required` };
        }

        if (!values || values?.length === 0) {
          continue;
        }

        // if other option is not enabled and value is not in options
        if (
          !field.otherOption &&
          values.some((value) => !field.options?.includes(value))
        ) {
          return { error: `Field ${field.name} has invalid values` };
        }

        fieldsData.set(field.id, values);
        continue;
      } else if (
        field.optionsStyle === "radio" ||
        field.optionsStyle === "dropdown"
      ) {
        const value = data.get(field.id) as string | undefined;
        if (field.required && !value) {
          return { error: `Field ${field.name} is required` };
        }

        if (!value) {
          continue;
        }

        if (!field.otherOption && value && !field.options?.includes(value)) {
          return { error: `Field ${field.name} has invalid value` };
        }

        fieldsData.set(field.id, [value]);
      }
    } else if (field.type === "text") {
      const value = data.get(field.id) as string | undefined;
      if (field.required && !value) {
        return { error: `Field ${field.name} is required` };
      }
      if (!value) continue;

      fieldsData.set(field.id, [value]);
    } else if (field.type === "date") {
      const value = data.get(field.id) as string | undefined;
      if (field.required && !value) {
        return { error: `Field ${field.name} is required` };
      }
      if (!value) continue;

      // verify that it is in iso date format
      if (new Date(value).toString() === "Invalid Date") {
        return { error: `Field ${field.name} has invalid date` };
      }

      fieldsData.set(field.id, [value]);
    } else if (field.type === "file") {
      const file = data.get(field.id) as File | null; // Get the File object

      if (field.required && !file) {
        return { error: `Field ${field.name} is required` };
      }
      if (!file) continue;

      // Validate the file with Zod (or any other validation library)
      const fileSchema = z.instanceof(File).refine(
        (file) => file.size > 0, // Ensure file size is greater than 0
        { message: "File is required and should not be empty" }
      );

      try {
        fileSchema.parse(file); // Validate the file
      } catch (e) {
        return { error: `Invalid file for field ${field.name}` };
      }
      // ........uploading to s3.................//
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileUrl = await uploadFile({ fileName: file.name, file: buffer });
      if (!fileUrl)
        return { error: `Error uploading file for field ${field.name}` };

      // ...............Simulate saving the file to a server or cloud storage ..........//
      // const filePath = `/uploads/${file.name}`; // Construct the file path string
      // Implement logic to save the file to the server/cloud storage
      // await fs.writeFile(
      //   `public${filePath}`,
      //   Buffer.from(await file.arrayBuffer())
      // );

      fieldsData.set(field.id, [fileUrl]); // Save the file path string in fieldsData for aws s3
      // fieldsData.set(field.id, [filePath]); // Save the file path string in fieldsData
    }
  }

  if (fieldsData.size === 0) {
    return { error: "This form submission has no fields filled out." };
  }

  console.log(fieldsData);
  const userId = await getCurrentUser();
  const submissionId = createId();

  await db.insert(schema.formSubmission).values({
    formId,
    userId,
    id: submissionId,
  });

  await db.insert(schema.formSubmissionFieldValue).values(
    Array.from(fieldsData.entries()).map(([fieldId, value]) => ({
      id: createId(),
      submissionId,
      fieldId,
      value,
    }))
  );

  return redirect(`/f/${formId}/submitted`);
}

// export async function submitForm(
//   prevState: any,
//   data: FormData
// ): Promise<{ error?: string } | void> {
//   const formId = data?.get("formId") as string | undefined;
//   if (!formId) return { error: "Form not found" };

//   const form = await db.query.form.findFirst({
//     where: eq(schema.form.id, formId),
//     columns: {
//       id: true,
//     },
//     with: {
//       fields: {
//         columns: {
//           id: true,
//           type: true,
//           required: true,
//           options: true,
//           otherOption: true,
//           optionsStyle: true,
//           textSize: true,
//           name: true,
//         },
//       },
//     },
//   });

//   if (!form) {
//     return {
//       error: "Form not found",
//     };
//   }

//   const fieldsData = new Map<string, string[]>();

//   for (const field of form.fields) {
//     if (field.type === "choice") {
//       // if checkbox get all values
//       if (field.optionsStyle === "checkbox") {
//         const values = data.getAll(field.id) as string[] | undefined;
//         if (field.required && values?.length === 0) {
//           return { error: `Field ${field.name} is required` };
//         }

//         if (!values || values?.length === 0) {
//           continue;
//         }

//         // if other option is not enabled and value is not in options
//         if (
//           !field.otherOption &&
//           values.some((value) => !field.options?.includes(value))
//         ) {
//           return { error: `Field ${field.name} has invalid values` };
//         }

//         fieldsData.set(field.id, values);
//         continue;
//       } else if (
//         field.optionsStyle === "radio" ||
//         field.optionsStyle === "dropdown"
//       ) {
//         const value = data.get(field.id) as string | undefined;
//         if (field.required && !value) {
//           return { error: `Field ${field.name} is required` };
//         }

//         if (!value) {
//           continue;
//         }

//         if (!field.otherOption && value && !field.options?.includes(value)) {
//           return { error: `Field ${field.name} has invalid value` };
//         }

//         fieldsData.set(field.id, [value]);
//       }
//     } else if (field.type === "text") {
//       const value = data.get(field.id) as string | undefined;
//       if (field.required && !value) {
//         return { error: `Field ${field.name} is required` };
//       }
//       if (!value) continue;

//       fieldsData.set(field.id, [value]);
//     } else if (field.type === "date") {
//       const value = data.get(field.id) as string | undefined;
//       if (field.required && !value) {
//         return { error: `Field ${field.name} is required` };
//       }
//       if (!value) continue;

//       // verify that it is in iso date format
//       if (new Date(value).toString() === "Invalid Date") {
//         return { error: `Field ${field.name} has invalid date` };
//       }

//       fieldsData.set(field.id, [value]);
//     }

//     else if (field.type === "file") {
//       const file = data.get(field.id) as File | null; // Get the File object

//       if (field.required && !file) {
//         return { error: `Field ${field.name} is required` };
//       }
//       if (!file) continue;

//       // Validate the file with Zod (or any other validation library)
//       const fileSchema = z.instanceof(File).refine(
//         (file) => file.size > 0, // Ensure file size is greater than 0
//         { message: "File is required and should not be empty" }
//       );

//       try {
//         fileSchema.parse(file); // Validate the file
//       } catch (e) {
//         return { error: `Invalid file for field ${field.name}` };
//       }
//       // ...
//       const filePath = `/uploads/${file.name}`; // Construct the file path string
//       // Implement logic to save the file to the server/cloud storage
//       await fs.writeFile(
//         `public${filePath}`,
//         Buffer.from(await file.arrayBuffer())
//       );

//       fieldsData.set(field.id, [filePath]); // Save the file path string in fie
//     }

//     if (fieldsData.size === 0) {
//       return {
//         error:
//           "This form submission is a little useless with no fields filled out.",
//       };
//     }

//     console.log("Fields Data:", Array.from(fieldsData.entries()));

//     const userId = await getCurrentUser();
//     const submissionId = createId();

//     await db.insert(schema.formSubmission).values({
//       formId,
//       userId,
//       id: submissionId,
//     });

//     await db.insert(schema.formSubmissionFieldValue).values(
//       Array.from(fieldsData.entries()).map(([fieldId, value]) => ({
//         id: createId(),
//         submissionId,
//         fieldId,
//         value,
//       }) )
//     );

//     return redirect(`/f/${formId}/submitted`);
//   }
// }

// ...
// const buffer = Buffer.from(await file.arrayBuffer());

// const fileUrl = await uploadFile({ fileName: file.name, file: buffer });

// if (!fileUrl) return { error: `Error uploading file for field ${field.name}` };

// fieldsData.set(field.id, [fileUrl]); // Store the S3 URL in fieldsData

// ...
