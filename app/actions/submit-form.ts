'use server';

import { db, schema } from "@/utils/db";
import { getCurrentUser } from "@/utils/jwt";
import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import fs from "fs/promises"
import {z} from "zod"

export async function submitForm(prevState: any, data: FormData): Promise<{ error?: string } | void> {
    const formId = data?.get('formId') as string | undefined
    if (!formId) return { error: "Form not found" }

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
                }
            }

        }
    })

    if (!form) {
        return {
            error: "Form not found"
        }
    }

    const fieldsData = new Map<string, string[]>()

    for (const field of form.fields) {

        if (field.type === "choice") {
            // if checkbox get all values
            if (field.optionsStyle === "checkbox") {
                const values = data.getAll(field.id) as string[] | undefined
                if (field.required && values?.length === 0) {
                    return { error: `Field ${field.name} is required` }
                }

                if (!values || values?.length === 0) {
                    continue
                }

                // if other option is not enabled and value is not in options
                if (!field.otherOption && values.some(value => !field.options?.includes(value))) {
                    return { error: `Field ${field.name} has invalid values` }
                }

                fieldsData.set(field.id, values)
                continue
            } else if (field.optionsStyle === "radio" || field.optionsStyle === "dropdown") {
                const value = data.get(field.id) as string | undefined
                if (field.required && !value) {
                    return { error: `Field ${field.name} is required` }
                }

                if (!value) {
                    continue
                }

                if (!field.otherOption && value && !field.options?.includes(value)) {
                    return { error: `Field ${field.name} has invalid value` }
                }

                fieldsData.set(field.id, [value])
            }
        } else if (field.type === "text") {
            const value = data.get(field.id) as string | undefined
            if (field.required && !value) {
                return { error: `Field ${field.name} is required` }
            }
            if (!value) continue

            fieldsData.set(field.id, [value])
        } else if (field.type === "date") {
            const value = data.get(field.id) as string | undefined
            if (field.required && !value) {
                return { error: `Field ${field.name} is required` }
            }
            if (!value) continue


            // verify that it is in iso date format
            if (new Date(value).toString() === "Invalid Date") {
                return { error: `Field ${field.name} has invalid date` }
            }

            fieldsData.set(field.id, [value])
        }
        else if (field.type === "file"){

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
        

            // Upload the file to UploadThing
            // try {
        // Upload the file to UploadThing
        // const uploadedFile = await uploadFiles({
        //     files: [file], // Send the file to be uploaded
        //     endpoint: 'image'  // Specify the correct endpoint, ensure it matches your router
        // });

    //     if (uploadedFile && uploadedFile.length > 0) {
    //         const fileUrl = uploadedFile[0].url;  // Get the uploaded file's URL

    //         // Store the uploaded file's URL instead of the file path
    //         fieldsData.set(field.id, [fileUrl]);
    //     } else {
    //         return { error: `Failed to upload the file for field ${field.name}` };
    //     }

    // } catch (uploadError) {
    //     return { error: `Error uploading file for field ${field.name}: ${uploadError.message}` };
    // }

            // Simulate saving the file to a server or cloud storage
            const filePath = `/uploads/${file.name}`; // Construct the file path string

            // Implement logic to save the file to the server/cloud storage
            // fs.writeFileSync(filePath, await file.arrayBuffer()); // Convert file to buffer and save

            await fs.writeFile(`public${filePath}`, Buffer.from(await file.arrayBuffer()))
            
            fieldsData.set(field.id, [filePath]); // Save the file path string in fieldsData 
            
            


    }
    }

    if (fieldsData.size === 0) {
        return { error: "This form submission is a little useless with no fields filled out." }
    }

    console.log(fieldsData)
    const userId = await getCurrentUser()
    const submissionId = createId()

    await db.insert(schema.formSubmission)
        .values({
            formId,
            userId,
            id: submissionId
        });
    
    await db.insert(schema.formSubmissionFieldValue)
        .values(
            Array.from(fieldsData.entries()).map(([fieldId, value]) => ({
                id: createId(),
                submissionId,
                fieldId,
                value
            }))
        );

    return redirect(`/f/${formId}/submitted`)
}