import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mock data sementara (akan diganti dengan Prisma)
let mockRatings = [
  {
    id: "1",
    productId: "1",
    userId: "user1",
    value: 5,
    comment: "Produk ini sangat bagus!",
    user: { name: "Ahmad", email: "ahmad@example.com" },
    images: [],
    createdAt: new Date("2023-10-01").toISOString(),
  },
  {
    id: "2",
    productId: "1",
    userId: "user2",
    value: 4,
    comment: "Harga sangat terjangkau dan kualitas bagus.",
    user: { name: "Budi", email: "budi@example.com" },
    images: [],
    createdAt: new Date("2023-10-15").toISOString(),
  },
  {
    id: "3",
    productId: "2",
    userId: "user3",
    value: 5,
    comment: "Sangat memuaskan!",
    user: { name: "Cindy", email: "cindy@example.com" },
    images: [],
    createdAt: new Date("2023-09-28").toISOString(),
  },
];

// GET /api/ratings - Mendapatkan ratings untuk produk tertentu
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const productId = url.searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Parameter productId diperlukan" },
        { status: 400 }
      );
    }

    // Ambil ratings dari database
    const ratings = await prisma.rating.findMany({
      where: {
        productId: productId,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ ratings });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data rating" },
      { status: 500 }
    );
  }
}

// POST /api/ratings - Menambahkan rating baru
export async function POST(request: Request) {
  try {
    // Cek autentikasi
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Anda harus login untuk memberikan rating" },
        { status: 401 }
      );
    }

    // Dapatkan data user dari database termasuk role
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    // Cek apakah user memiliki hak untuk memberikan rating
    if (user.role !== "admin" && user.role !== "rater") {
      return NextResponse.json(
        { error: "Anda tidak memiliki izin untuk memberikan rating" },
        { status: 403 }
      );
    }

    // Parse body
    const { productId, value, comment, images } = await request.json();

    // Validasi input
    if (!productId) {
      return NextResponse.json(
        { error: "ID produk diperlukan" },
        { status: 400 }
      );
    }

    if (!value || value < 1 || value > 5) {
      return NextResponse.json(
        { error: "Rating harus antara 1-5" },
        { status: 400 }
      );
    }

    // Cek apakah produk ada
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      // Untuk keperluan development, jika produk tidak ada di database,
      // kita akan menggunakan mock data
      if (!["1", "2", "3", "4"].includes(productId)) {
        return NextResponse.json(
          { error: "Produk tidak ditemukan" },
          { status: 404 }
        );
      }
    }

    // Cek apakah user sudah memberikan rating untuk produk ini
    const existingRating = await prisma.rating.findFirst({
      where: {
        userId: session.user.id,
        productId: productId,
      },
    });

    let rating;

    if (existingRating) {
      // Update rating yang sudah ada
      rating = await prisma.rating.update({
        where: { id: existingRating.id },
        data: {
          value,
          comment,
        },
      });

      // Hapus gambar lama jika ada
      if (images && images.length > 0) {
        await prisma.ratingImage.deleteMany({
          where: { ratingId: existingRating.id },
        });

        // Tambahkan gambar baru
        for (const image of images) {
          await prisma.ratingImage.create({
            data: {
              ratingId: existingRating.id,
              url: image.url,
              public_id: image.public_id,
            },
          });
        }
      }
    } else {
      // Buat rating baru
      rating = await prisma.rating.create({
        data: {
          userId: session.user.id,
          productId,
          value,
          comment,
        },
      });

      // Tambahkan gambar jika ada
      if (images && images.length > 0) {
        for (const image of images) {
          await prisma.ratingImage.create({
            data: {
              ratingId: rating.id,
              url: image.url,
              public_id: image.public_id,
            },
          });
        }
      }
    }

    // Ambil rating lengkap dengan relasi
    const createdRating = await prisma.rating.findUnique({
      where: { id: rating.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        images: true,
      },
    });

    return NextResponse.json({
      message: existingRating
        ? "Rating berhasil diperbarui"
        : "Rating berhasil ditambahkan",
      rating: createdRating,
    });
  } catch (error) {
    console.error("Error creating rating:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menyimpan rating" },
      { status: 500 }
    );
  }
} 