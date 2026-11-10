import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { uploadToR2, getPresignedUploadUrl } from "@/lib/r2";

// POST handler for direct file upload (e.g. image thumbnail, PDF materials)
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentType = req.headers.get("content-type") || "";

    // If JSON body, user is requesting a presigned URL (useful for direct large video upload)
    if (contentType.includes("application/json")) {
      const { fileName, fileType } = await req.json();
      if (!fileName || !fileType) {
        return NextResponse.json(
          { error: "fileName and fileType are required" },
          { status: 400 }
        );
      }

      const presignedData = await getPresignedUploadUrl(fileName, fileType);
      return NextResponse.json(presignedData);
    }

    // Direct multipart form-data upload for images/documents
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided in form data" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileUrl = await uploadToR2(buffer, file.name, file.type);

    return NextResponse.json({
      url: fileUrl,
      fileName: file.name,
      size: file.size,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to upload file to Cloudflare R2" },
      { status: 500 }
    );
  }
}

