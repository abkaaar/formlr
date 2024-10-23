import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// Authentication function, modify as needed for your authentication logic
const auth = (req: Request) => ({ id: "fakeId" }); // Replace with real auth logic

// Define the FileRouter for your app
export const ourFileRouter = {
  fileUploader: f({ 
    // Specify allowed types explicitly (e.g., 'blob' to support general file types, 'image' for images)
    blob: { maxFileSize: "4MB", maxFileCount: 1 }, 
  })
    // Middleware to handle authentication and set metadata before the upload starts
    .middleware(async ({ req }) => {
      const user = await auth(req);

      if (!user) throw new UploadThingError("Unauthorized"); // Reject unauthorized users

      return { userId: user.id }; // Pass user data to be used later in onUploadComplete
    })
    // Handler to be executed after the upload completes
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);

      // Perform any post-upload actions, e.g., storing file URL in database
      return { uploadedBy: metadata.userId, fileUrl: file.url }; // Include file URL for client-side usage
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
