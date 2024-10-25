import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import mime from "mime-types";
//uploadFile.ts
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "", 
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  }
})


//uploadFile.ts

export const uploadFile = async ({
  fileName,
  file,
}: {
  fileName: string;
  file: Buffer;
}) => {
  try {
    const contentType = mime.lookup(fileName) || "application/octet-stream";
    const sendRes = await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileName,
        Body: file,
        ContentType: contentType,
      })
    );
    const meta = sendRes.$metadata;
    if (meta.httpStatusCode !== 200)
      throw new Error(
        `Error uploading file, with status: ${meta.httpStatusCode}`
      );

    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  } catch (err) {
    console.log(err);
  }
};