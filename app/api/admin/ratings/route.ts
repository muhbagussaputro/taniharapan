import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/admin/ratings - Mendapatkan semua ratings untuk admin
export async function GET(request: Request) {
  try {
    // Cek autentikasi dan otorisasi admin
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Anda harus login untuk mengakses halaman ini" },
        { status: 401 }
      );
    }
    
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });
    
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Anda tidak memiliki izin untuk mengakses halaman ini" },
        { status: 403 }
      );
    }
    
    // Ambil semua ratings dari database
    const ratings = await prisma.rating.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        images: true,
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json({ ratings });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data ratings" },
      { status: 500 }
    );
  }
} 