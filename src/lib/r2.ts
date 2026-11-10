import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || "";
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || "";
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || "";
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "coursera-assets";
const R2_PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN || "";

export const isR2Configured = Boolean(
  R2_ACCOUNT_ID &&
  R2_ACCESS_KEY_ID &&
  R2_SECRET_ACCESS_KEY &&
  !R2_ACCOUNT_ID.includes("your_") &&
  !R2_ACCESS_KEY_ID.includes("your_")
);

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

/**
 * Upload buffer directly to Cloudflare R2
 */
export async function uploadToR2(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  const cleanFileName = `${Date.now()}-${fileName.replace(/\s+/g, "-")}`;
  
  if (!isR2Configured) {
    // Development fallback mock URL if R2 credentials are not yet populated
    console.warn("⚠️ Cloudflare R2 credentials not fully configured. Using fallback URL.");
    return `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop`;
  }

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: cleanFileName,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await r2Client.send(command);

  // Return public URL
  if (R2_PUBLIC_DOMAIN) {
    const domain = R2_PUBLIC_DOMAIN.endsWith("/")
      ? R2_PUBLIC_DOMAIN.slice(0, -1)
      : R2_PUBLIC_DOMAIN;
    return `${domain}/${cleanFileName}`;
  }

  return `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/${cleanFileName}`;
}

/**
 * Generate a pre-signed URL for direct client-to-R2 upload (e.g. for large video files)
 */
export async function getPresignedUploadUrl(
  fileName: string,
  contentType: string,
  expiresIn = 3600
) {
  const cleanFileName = `videos/${Date.now()}-${fileName.replace(/\s+/g, "-")}`;

  if (!isR2Configured) {
    return {
      uploadUrl: "/api/upload/mock",
      fileUrl: `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`,
      key: cleanFileName,
      isMock: true,
    };
  }

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: cleanFileName,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn });

  const fileUrl = R2_PUBLIC_DOMAIN
    ? `${R2_PUBLIC_DOMAIN.replace(/\/$/, "")}/${cleanFileName}`
    : `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/${cleanFileName}`;

  return {
    uploadUrl,
    fileUrl,
    key: cleanFileName,
    isMock: false,
  };
}

/**
 * Delete an object from Cloudflare R2
 */
export async function deleteFromR2(fileKey: string) {
  if (!isR2Configured) return;

  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: fileKey,
  });

  await r2Client.send(command);
}

