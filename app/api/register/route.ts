import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Semua field harus diisi" },
        { status: 400 }
      );
    }

    // Cek email sudah ada atau belum
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "user", // Default role
      },
    });

    // Hapus password dari response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        user: userWithoutPassword,
        message: "Registrasi berhasil",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error detail:", error);
    
    // Lebih detail error untuk debugging
    let errorMessage = "Terjadi kesalahan saat registrasi";
    if (error instanceof Error) {
      errorMessage = `${errorMessage}: ${error.message}`;
      console.error("Error name:", error.name);
      console.error("Error stack:", error.stack);
    }
    
    // Log environment untuk debugging
    console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
    console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}