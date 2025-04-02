"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import CloudinaryImage from "./CloudinaryImage";
import Link from "next/link";

const heroImages = [
  "https://dummyimage.com/1200x600/4CAF50/fff&text=Tani+Harapan+1",
  "https://dummyimage.com/1200x600/2196F3/fff&text=Tani+Harapan+2",
];

export default function Hero() {
  return (
    <LazyMotion features={domAnimation}>
      <section className="relative h-[600px] overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <CloudinaryImage
            src={heroImages[0]}
            alt="Banner tanaman subur"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
        </div>

        <div className="container relative z-10 h-full flex flex-col justify-center">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              Solusi Organik untuk Pertanian yang Berkelanjutan
            </h1>
            <p className="text-lg text-white mb-8">
              Tingkatkan hasil panen hingga 40% dengan nutrisi tanaman premium
              kami yang 100% organik dan ramah lingkungan
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/#products" className="btn btn-primary">
                Lihat Produk
              </Link>
              <Link
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline text-white border-white hover:bg-white hover:text-primary-600"
              >
                Hubungi Kami
              </Link>
            </div>
          </m.div>
        </div>
      </section>
    </LazyMotion>
  );
} 