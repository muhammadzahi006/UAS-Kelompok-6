import { NextRequest, NextResponse } from "next/server";

export async function PUT(_req: NextRequest) {
  // Mock endpoint for presigned upload when R2 credentials are not yet configured in local test
  return NextResponse.json({
    success: true,
    message: "File mock uploaded successfully",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  });
}

