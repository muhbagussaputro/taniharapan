import { Metadata } from "next";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductDetailClient from "./ProductDetailClient";
import RatingDisplay from '@/components/RatingDisplay';

interface PageParams {
  id: string;
}

export const metadata: Metadata = {
  title: "Detail Produk - Naturagen",
  description: "Detail produk pertanian organik Naturagen",
};

const marketplaces = [
  {
    name: "Shopee",
    icon: "/shopee.png",
    color: "bg-orange-50 text-orange-500 border-orange-200",
    url: "https://shopee.co.id/",
  },
  {
    name: "Tokopedia",
    icon: "/tokopedia.png",
    color: "bg-green-50 text-green-500 border-green-200",
    url: "https://www.tokopedia.com/",
  },
  {
    name: "TikTok Shop",
    icon: "/tiktok.png",
    color: "bg-gray-50 text-gray-500 border-gray-200",
    url: "https://www.tiktok.com/shop/",
  },
  {
    name: "Lazada",
    icon: "/lazada.png",
    color: "bg-blue-50 text-blue-500 border-blue-200",
    url: "https://www.lazada.co.id/",
  },
];

// Data produk sementara
const mockProduct = {
  id: "1",
  name: "BioPlantz Nutrisi Tanaman",
  description: "Nutrisi organik lengkap untuk semua jenis tanaman. Mempercepat pertumbuhan dan meningkatkan hasil panen hingga 40%. Aman untuk semua jenis tanaman.",
  price: 75000,
  image: "/vercel.svg",
  ratings: [],
  averageRating: 4.5
};

export default function Page({ params }: { params: Promise<PageParams> }) {
  // Gunakan React.use untuk mengakses params yang berupa Promise
  const paramsData = React.use(params);
  const product = mockProduct;
  
  return (
    <>
      <Header />
      <main className="bg-gray-50 py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
            <div className="rounded-2xl overflow-hidden shadow-md">
              <Image
                src={product.image}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-auto object-cover"
                priority
              />
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <div className="flex items-center mb-4">
                  <span className="text-yellow-500 text-xl mr-1">★</span>
                  <span className="font-semibold">{product.averageRating.toFixed(1)}</span>
                  <span className="text-gray-500 ml-2">({product.ratings.length} ulasan)</span>
                </div>
                <p className="text-2xl font-bold text-primary-600">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(product.price)}
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-3">Deskripsi Produk</h2>
                <p className="text-gray-700">{product.description}</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-3">Beli di Marketplace</h2>
                <div className="grid grid-cols-2 gap-3">
                  {marketplaces.map((marketplace) => (
                    <Link
                      key={marketplace.name}
                      href={marketplace.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center p-3 rounded border ${marketplace.color} hover:opacity-90 transition-opacity`}
                    >
                      <Image
                        src={marketplace.icon}
                        alt={marketplace.name}
                        width={20}
                        height={20}
                        className="mr-2"
                      />
                      <span className="font-medium">{marketplace.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary w-full py-3 text-center inline-flex justify-center"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Pesan Langsung via WhatsApp
              </Link>
            </div>
          </div>

          <ProductDetailClient 
            productId={product.id} 
            productName={product.name}
            ratings={[]} 
            userRating={null}
          />

          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-6">Ulasan Produk</h2>
            <RatingDisplay 
              ratings={[]} 
              avgRating={product.averageRating} 
              totalRatings={0} 
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 