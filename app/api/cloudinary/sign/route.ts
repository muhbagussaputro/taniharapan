import { NextResponse } from "next/server";
import { generateSignature } from "@/utils/cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { v2 as cloudinary } from 'cloudinary';

export async function POST(request: Request) {
  try {
    // Optional: Periksa jika user sudah login
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { public_id } = data;

    if (!public_id) {
      return NextResponse.json(
        { error: "Public ID harus disediakan" },
        { status: 400 }
      );
    }

    // Generate timestamp
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Generate signature
    const signature = generateSignature(public_id, timestamp);

    return NextResponse.json({
      signature,
      timestamp,
      cloudname: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    });
  } catch (error) {
    console.error("Error generating signature:", error);
    return NextResponse.json(
      { error: "Gagal membuat signature" },
      { status: 500 }
    );
  }
} 