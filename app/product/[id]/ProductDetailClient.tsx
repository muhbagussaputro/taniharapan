"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import ProductRating from "@/components/ProductRating";
import RatingForm from "@/components/RatingForm";
import Link from "next/link";

interface ProductDetailClientProps {
  productId: string;
  productName: string;
  ratings: any[];
  userRating: any;
}

export default function ProductDetailClient({
  productId,
  productName,
  ratings,
  userRating,
}: ProductDetailClientProps) {
  const { data: session } = useSession();
  const [showRatingForm, setShowRatingForm] = useState(false);

  const handleRatingSuccess = () => {
    setShowRatingForm(false);
  };

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Beri Ulasan Produk</h2>
      
      {!session ? (
        <div className="bg-gray-50 p-6 rounded-xl shadow-sm text-center">
          <p className="mb-4">Anda harus login untuk memberikan ulasan</p>
          <Link href="/login" className="btn btn-primary">
            Login Sekarang
          </Link>
        </div>
      ) : showRatingForm ? (
        <RatingForm 
          productId={productId} 
          productName={productName}
          onSuccess={handleRatingSuccess} 
        />
      ) : (
        <div className="bg-gray-50 p-6 rounded-xl shadow-sm text-center">
          <p className="mb-4">Bagikan pengalaman Anda menggunakan produk ini</p>
          <button 
            onClick={() => setShowRatingForm(true)}
            className="btn btn-primary"
          >
            Tulis Ulasan
          </button>
        </div>
      )}
    </div>
  );
} 