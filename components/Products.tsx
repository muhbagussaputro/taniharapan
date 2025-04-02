"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import CloudinaryImage from "./CloudinaryImage";

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

const products = [
  {
    id: "1",
    name: "BioPlantz Nutrisi Tanaman",
    price: 75000,
    description: "Nutrisi organik lengkap untuk semua jenis tanaman. Mempercepat pertumbuhan dan meningkatkan hasil panen.",
    image: "https://dummyimage.com/600x400/4CAF50/fff&text=Nutrisi+Tanaman",
  },
  {
    id: "2",
    name: "GrowMax Pupuk Organik",
    price: 120000,
    description: "Pupuk organik premium yang kaya akan nutrisi esensial untuk pertumbuhan tanaman yang optimal.",
    image: "https://dummyimage.com/600x400/2196F3/fff&text=Pupuk+Organik",
  },
  {
    id: "3",
    name: "AgroBoost Penguat Tanaman",
    price: 95000,
    description: "Formula khusus untuk meningkatkan ketahanan tanaman terhadap hama dan penyakit.",
    image: "https://dummyimage.com/600x400/FFC107/000&text=Penguat+Tanaman",
  },
  {
    id: "4",
    name: "HydroFresh Pelembab Tanah",
    price: 85000,
    description: "Menjaga kelembaban tanah dan meningkatkan efisiensi penyerapan air untuk tanaman.",
    image: "https://dummyimage.com/600x400/9C27B0/fff&text=Pelembab+Tanah",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Products() {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <LazyMotion features={domAnimation}>
      <section className="py-20 bg-gray-50" id="products">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Produk <span className="text-primary-600">Naturagen</span>
            </h2>
            <p className="text-gray-600">
              Pilihan tepat untuk meningkatkan produktivitas pertanian Anda dengan cara yang ramah lingkungan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <m.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-60">
                  <CloudinaryImage
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority={index < 2}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 truncate">{product.name}</h3>
                  <p className="text-primary-600 font-bold mb-2">{formatPrice(product.price)}</p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                  <Link
                    href={`/produk/${product.id}`}
                    className="btn btn-primary w-full text-center"
                  >
                    Detail Produk
                  </Link>
                </div>
              </m.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary inline-flex items-center mr-4"
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Pesan Langsung via WhatsApp
            </Link>
            
            <Link
              href="/produk"
              className="btn btn-secondary inline-flex items-center"
            >
              Lihat Semua Produk
            </Link>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}