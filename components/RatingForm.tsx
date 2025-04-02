"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera, X, Loader2 } from "lucide-react";
import { LazyMotion, domAnimation, m } from "framer-motion";

interface RatingFormProps {
  productId: string;
  productName: string;
  onSuccess?: () => void;
}

export default function RatingForm({ productId, productName, onSuccess }: RatingFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles = Array.from(e.target.files);
    const totalImages = images.length + newFiles.length;
    
    if (totalImages > 3) {
      setError("Maksimal 3 gambar yang dapat diunggah");
      return;
    }
    
    setError("");
    
    // Create preview URLs for images
    const newPreviewImages = newFiles.map(file => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...newPreviewImages]);
    setImages([...images, ...newFiles]);
  };

  const removeImage = (index: number) => {
    // Remove the image from both arrays
    const newImages = [...images];
    const newPreviewImages = [...previewImages];
    
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(newPreviewImages[index]);
    
    newImages.splice(index, 1);
    newPreviewImages.splice(index, 1);
    
    setImages(newImages);
    setPreviewImages(newPreviewImages);
  };

  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push("/login");
      return;
    }

    if (rating === 0) {
      setError("Mohon berikan rating terlebih dahulu");
      return;
    }

    setIsSubmitting(true);
    setError("");
    
    try {
      // Skip image upload for now since Cloudinary isn't set up correctly
      // Just submit the rating without images
      console.log("Submitting rating without images");
      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          value: rating,
          comment,
          images: [], // Empty array for now
        }),
      });

      const responseData = await response.json();
      console.log("Rating response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.error || "Gagal mengirim rating");
      }

      // Clean up preview URLs to prevent memory leaks
      previewImages.forEach(url => URL.revokeObjectURL(url));
      
      // Reset form
      setRating(0);
      setComment("");
      setImages([]);
      setPreviewImages([]);
      
      // Panggil callback onSuccess jika disediakan
      if (onSuccess) {
        onSuccess();
      }
      
      // Refresh halaman - tidak perlu karena sudah menggunakan onSuccess
      // router.refresh();
    } catch (error) {
      console.error("Error submitting rating:", error);
      setError(error instanceof Error ? error.message : "Terjadi kesalahan saat mengirim rating");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Berikan Ulasan untuk {productName}</h3>
        
        {error && (
          <m.div 
            className="bg-red-50 text-red-700 p-3 rounded-md mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </m.div>
        )}
        
        <form onSubmit={handleRatingSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-2">Rating</label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1"
                >
                  <svg
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label htmlFor="comment" className="block text-gray-700 mb-2">
              Komentar (Opsional)
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={4}
              placeholder="Bagikan pengalaman Anda menggunakan produk ini..."
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">
              Foto Produk (Opsional, maks. 3 foto)
            </label>
            
            <div className="flex flex-wrap gap-3 mb-3">
              {previewImages.map((src, index) => (
                <div key={index} className="relative w-24 h-24 border rounded-md overflow-hidden">
                  <Image
                    src={src}
                    alt={`Preview ${index + 1}`}
                    className="object-cover"
                    fill
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              
              {images.length < 3 && (
                <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-primary-500 transition-colors">
                  <div className="text-center">
                    <Camera className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                    <span className="text-xs text-gray-500">Tambah Foto</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
            
            <p className="text-xs text-gray-500 mt-1">
              Format: JPG, PNG, atau GIF. Ukuran maksimal 5MB per foto.
            </p>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn btn-primary py-3"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Mengirim...
              </span>
            ) : (
              "Kirim Ulasan"
            )}
          </button>
        </form>
      </div>
    </LazyMotion>
  );
} 