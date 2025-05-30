'use server'

import { db, schema } from "@/utils/db"
import { getCurrentUser } from "@/utils/jwt"
import { createId } from "@paralleldrive/cuid2"
import { and, eq, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function SaveForm(data: FormData): Promise<void> {
    const formId = data.get('form:id')
    const userId = await getCurrentUser()
    if (!userId || !formId || typeof formId !== "string")  
         { 
            throw new Error("Unauthorized");
        }

    const name = (data.get('form:name') ?? undefined) as string | undefined
    const description = (data.get('form:description') ?? undefined) as string | undefined

    const change = await db.update(schema.form)
        .set({
            name,
            description,
            lastModified: new Date(),
        })
        .where(and(
            eq(schema.form.id, formId),
            eq(schema.form.userId, userId)
        ))
        .returning({ id: schema.form.id })

    if (!change?.[0]?.id){
        { 
            throw new Error("Unauthorized");
        }
    }

    console.time("update")

    const fieldIds = data.getAll("form:field-ids")
    await Promise.all(
        fieldIds.map((fieldId, i) => {
            if (typeof fieldId !== "string") return

            const name = (data.get(`form:${fieldId}:name`) ?? undefined) as string | undefined
            const description = (data.get(`form:${fieldId}:description`) ?? undefined) as string | undefined
            const required = (data.get(`form:${fieldId}:required`) ?? undefined) as string | undefined

            const options = (data.getAll(`form:${fieldId}:options`) ?? undefined) as string[] | undefined
            const otherOption = (data.get(`form:${fieldId}:other-option`) ?? undefined) as string | undefined
            const optionsStyle = (data.get(`form:${fieldId}:options-style`) ?? undefined) as "dropdown" | "radio" | "checkbox" | undefined
            const shuffleOptions = (data.get(`form:${fieldId}:shuffle-options`) ?? undefined) as "true" | "false" | undefined
            const textSize = (data.get(`form:${fieldId}:text-size`) ?? undefined) as "normal" | "textarea" | undefined

            return db.update(schema.formField)
                .set({
                    name,
                    description,
                    options,
                    otherOption: otherOption === undefined ? undefined : otherOption === "true",
                    required: required === undefined ? undefined : required === "true",
                    shuffleOptions: shuffleOptions === undefined ? undefined : shuffleOptions === "true",
                    optionsStyle,
                    textSize,
                    index: i,
                })
                .where(and(
                    eq(schema.formField.id, fieldId),
                    eq(schema.formField.formId, formId)
                ))
        })
    )
    console.timeEnd("update")

    revalidatePath(`/f/${formId}`)
    revalidatePath(`/f/${formId}/submitted`)
    return revalidatePath(`/editor/${formId}`)
}

export async function makeField(formId: string, type: "text" | "choice" | "date" | "file") {
    const userId = await getCurrentUser()
    if (!userId || !formId) return "unauthorized"

    const field = await db.insert(schema.formField)
        .values({
            formId,
            name: "New Field",
            type,
            index: sql<number>`COALESCE((SELECT MAX(index) FROM form_field WHERE form_id = ${formId}), -1) + 1`,
            id: createId(),
            options: type === "choice" ? ["New choice"] : undefined,
        })
        .returning({ id: schema.formField.id })

    if (!field?.[0]?.id) return "unauthorized"

    revalidatePath(`/f/${formId}`)
    return revalidatePath(`/editor/${formId}`)
}

export async function deleteField(formId: string, fieldId: string) {
    const userId = await getCurrentUser()
    if (!userId || !formId) return "unauthorized"

    const field = await db.delete(schema.formField)
        .where(and(
            eq(schema.formField.formId, formId),
            eq(schema.formField.id, fieldId)
        ))
        .returning({ id: schema.formField.id })

    if (!field) return "unauthorized"

    revalidatePath(`/f/${formId}`)
    return revalidatePath(`/editor/${formId}`)
}

export async function makeForm(formData: FormData): Promise<void> {
    const userId = await getCurrentUser()
    if (!userId){
         // Optionally throw an error or handle it differently based on your requirements
         throw new Error("Unauthorized");
    } 
        
        // return "unauthorized"

    const form = await db.insert(schema.form)
        .values({
            name: "Untitled Form",
            userId,
            id: createId()
        })
        .returning({ id: schema.form.id })

    if (!form?.[0]?.id){
        throw new Error("Form creation failed");
    }

    await db.insert(schema.formField)
        .values([
            {
                name: "Untitled Question",
                formId: form[0].id,
                id: createId(),
                type: "text",
                index: 0,
            }
        ])

    return redirect(`/editor/${form[0].id}`)
}

// export async function deleteForm(formId: string): Promise<void> {
//     const userId = await getCurrentUser();
//     if (!userId || !formId) {
//         throw new Error("Unauthorized");
//     }

//     console.log("Attempting to delete form:", formId, "by user:", userId);

//     // Check if form belongs to user
//     const existingForm = await db.query.form.findFirst({
//         where: and(
//             eq(schema.form.id, formId),
//             eq(schema.form.userId, userId)
//         )
//     });

//     if (!existingForm) {
//         throw new Error("Form not found or unauthorized access");
//     }

//     // Delete all fields associated with the form
//     await db.delete(schema.formField)
//         .where(eq(schema.formField.formId, formId));

//     // Delete the form
//     const form = await db.delete(schema.form)
//         .where(and(
//             eq(schema.form.id, formId),
//             eq(schema.form.userId, userId)
//         ))
//         .returning({ id: schema.form.id });

//     if (!form?.[0]?.id) {
//         throw new Error("Form deletion failed");
//     }

//     revalidatePath(`/`);
//     revalidatePath(`/dashboard`);
// }

export async function deleteForm(formData: FormData): Promise<void> {
    const userId = await getCurrentUser();
    const formId = formData.get("formId");
  
    if (!userId || !formId || typeof formId !== "string") {
      throw new Error("Unauthorized");
    }
  
    const existingForm = await db.query.form.findFirst({
      where: and(
        eq(schema.form.id, formId),
        eq(schema.form.userId, userId)
      )
    });
  
    if (!existingForm) {
      throw new Error("Form not found or unauthorized access");
    }
  
    await db.delete(schema.formField).where(eq(schema.formField.formId, formId));
    await db.delete(schema.form).where(eq(schema.form.id, formId));
  
    revalidatePath(`/`);
    revalidatePath(`/dashboard`);
  }
  