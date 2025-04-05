import { Suspense } from "react";
import React from "react";
import { PrismaClient } from "@prisma/client";
import ProductClient from "./ProductClient";

const prisma = new PrismaClient();

interface PageParams {
  id: string;
}

// Mendapatkan semua ID produk untuk static generation
export async function generateStaticParams() {
  // Ini hanya contoh, dalam implementasi nyata bisa ambil dari database
  return [
    { id: "1" },
    { id: "2" },
    { id: "3" },
    { id: "4" }
  ];
}

// Server component untuk halaman detail produk
export default function ProductDetailPage({ params }: { params: Promise<PageParams> }) {
  // Gunakan React.use untuk mengakses params yang berupa Promise
  const paramsData = React.use(params);
  const productId = paramsData.id;
  
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
      </div>
    }>
      <ProductClient productId={productId} />
    </Suspense>
  );
} 