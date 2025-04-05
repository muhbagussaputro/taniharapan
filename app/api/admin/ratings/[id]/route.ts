import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/options";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Middleware untuk memeriksa autentikasi admin
async function checkAdminAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return {
      isAuthorized: false,
      response: NextResponse.json(
        { error: "Anda harus login untuk mengakses halaman ini" },
        { status: 401 }
      )
    };
  }
  
  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });
  
  if (!user || user.role !== "admin") {
    return {
      isAuthorized: false,
      response: NextResponse.json(
        { error: "Anda tidak memiliki izin untuk mengakses halaman ini" },
        { status: 403 }
      )
    };
  }
  
  return { isAuthorized: true, user };
}

// GET /api/admin/ratings/[id] - Mendapatkan detail rating
export async function GET(request: Request) {
  try {
    const auth = await checkAdminAuth();
    if (!auth.isAuthorized) {
      return auth.response;
    }

    // Extract ID from URL
    const id = request.url.split('/').pop();

    const rating = await prisma.rating.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        images: true,
      },
    });

    if (!rating) {
      return NextResponse.json(
        { error: "Rating tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ rating });
  } catch (error) {
    console.error("Error fetching rating:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data rating" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/ratings/[id] - Update rating
export async function PUT(request: Request) {
  try {
    const auth = await checkAdminAuth();
    if (!auth.isAuthorized) {
      return auth.response;
    }

    // Extract ID from URL
    const id = request.url.split('/').pop();
    const { value, comment } = await request.json();

    // Validasi
    if (!value || value < 1 || value > 5) {
      return NextResponse.json(
        { error: "Rating harus antara 1-5" },
        { status: 400 }
      );
    }

    // Cek apakah rating ada
    const existingRating = await prisma.rating.findUnique({
      where: { id },
    });

    if (!existingRating) {
      return NextResponse.json(
        { error: "Rating tidak ditemukan" },
        { status: 404 }
      );
    }

    // Update rating
    const updatedRating = await prisma.rating.update({
      where: { id },
      data: {
        value,
        comment,
      },
    });

    return NextResponse.json({
      message: "Rating berhasil diperbarui",
      rating: updatedRating,
    });
  } catch (error) {
    console.error("Error updating rating:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memperbarui rating" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/ratings/[id] - Hapus rating
export async function DELETE(request: Request) {
  try {
    const auth = await checkAdminAuth();
    if (!auth.isAuthorized) {
      return auth.response;
    }

    // Extract ID from URL
    const id = request.url.split('/').pop();

    // Cek apakah rating ada
    const existingRating = await prisma.rating.findUnique({
      where: { id },
    });

    if (!existingRating) {
      return NextResponse.json(
        { error: "Rating tidak ditemukan" },
        { status: 404 }
      );
    }

    // Hapus gambar terkait terlebih dahulu (karena ada foreign key constraint)
    await prisma.ratingImage.deleteMany({
      where: { ratingId: id },
    });

    // Hapus rating
    await prisma.rating.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Rating berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting rating:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menghapus rating" },
      { status: 500 }
    );
  }
} 