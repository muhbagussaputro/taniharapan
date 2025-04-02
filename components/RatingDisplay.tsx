"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { X } from "lucide-react";

interface RatingImage {
  id: string;
  url: string;
  public_id: string;
}

interface RatingUser {
  id: string;
  name: string | null;
  email: string | null;
}

interface Rating {
  id: string;
  value: number;
  comment: string | null;
  userId: string;
  productId: string;
  createdAt: string;
  user?: RatingUser;  // Make user optional
  images: RatingImage[];
}

interface RatingDisplayProps {
  ratings: Rating[];
  avgRating: number;
  totalRatings: number;
}

export default function RatingDisplay({ ratings, avgRating, totalRatings }: RatingDisplayProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  // Log the ratings for debugging
  useEffect(() => {
    console.log("Ratings in RatingDisplay:", ratings);
  }, [ratings]);

  const openLightbox = (imageUrl: string) => {
    setCurrentImage(imageUrl);
    setLightboxOpen(true);
    // Prevent scrolling on body when lightbox is open
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    // Restore scrolling
    document.body.style.overflow = "auto";
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="bg-white p-8 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Ulasan Pelanggan</h2>

        <div className="mb-8">
          <div className="flex items-center mb-2">
            <div className="flex mr-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-6 h-6 ${
                    star <= Math.round(avgRating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xl font-bold">{avgRating.toFixed(1)}</span>
            <span className="text-gray-500 ml-2">({totalRatings} ulasan)</span>
          </div>
        </div>

        <div className="space-y-6">
          {ratings && ratings.length > 0 ? (
            ratings.map((rating) => (
              <m.div 
                key={rating.id} 
                className="border-b border-gray-200 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between mb-2">
                  <div>
                    <p className="font-medium">
                      {/* Safely access user name */}
                      {rating.user ? (rating.user.name || "Pengguna") : "Pengguna"}
                    </p>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 ${
                            star <= rating.value ? "text-yellow-400" : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(rating.createdAt).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                
                {rating.comment && (
                  <p className="text-gray-700 mb-4">{rating.comment}</p>
                )}
                
                {rating.images && rating.images.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-3">
                    {rating.images.map((image) => (
                      <div 
                        key={image.id} 
                        className="w-20 h-20 rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => openLightbox(image.url)}
                      >
                        <Image
                          src={image.url}
                          alt="Gambar ulasan"
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </m.div>
            ))
          ) : (
            <p className="text-gray-500">Belum ada ulasan untuk produk ini.</p>
          )}
        </div>

        {/* Image Lightbox */}
        {lightboxOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button 
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2"
              onClick={closeLightbox}
            >
              <X size={24} />
            </button>
            <div className="relative max-w-4xl max-h-[80vh] w-full h-full" onClick={(e) => e.stopPropagation()}>
              <Image 
                src={currentImage} 
                alt="Gambar ulasan yang diperbesar" 
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </LazyMotion>
  );
} 