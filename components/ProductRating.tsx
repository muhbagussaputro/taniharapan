"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Rating {
  id: string;
  value: number;
  comment?: string;
  userId: string;
  user: {
    name: string;
    email: string;
  };
  createdAt: string;
}

interface ProductRatingProps {
  productId: string;
  ratings: Rating[];
  userRating?: Rating;
}

export default function ProductRating({
  productId,
  ratings,
  userRating,
}: ProductRatingProps) {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [rating, setRating] = useState<number>(userRating?.value || 0);
  const [comment, setComment] = useState<string>(userRating?.comment || "");
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const calculateAverageRating = () => {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, curr) => acc + curr.value, 0);
    return sum / ratings.length;
  };

  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push("/login");
      return;
    }

    if (rating === 0) {
      alert("Mohon berikan rating terlebih dahulu");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          value: rating,
          comment,
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal mengirim rating");
      }

      router.refresh();
      alert("Terima kasih telah memberikan rating!");
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Terjadi kesalahan saat mengirim rating. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating = calculateAverageRating();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Ulasan Produk</h2>

      <div className="mb-8">
        <div className="flex items-center mb-2">
          <div className="flex mr-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-6 h-6 ${
                  star <= averageRating
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
          <span className="text-xl font-bold">{averageRating.toFixed(1)}</span>
          <span className="text-gray-500 ml-2">({ratings.length} ulasan)</span>
        </div>
      </div>

      {!userRating && session ? (
        <div className="mb-8 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Berikan Ulasan Anda</h3>
          <form onSubmit={handleRatingSubmit} className="space-y-4">
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
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? "Mengirim..." : "Kirim Ulasan"}
            </button>
          </form>
        </div>
      ) : !session ? (
        <div className="mb-8 bg-gray-50 p-4 rounded-lg text-center">
          <p className="mb-4">Silakan login untuk memberikan ulasan</p>
          <Link href="/login" className="btn btn-primary">
            Login
          </Link>
        </div>
      ) : (
        <div className="mb-8 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Ulasan Anda</h3>
          <div className="flex mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-6 h-6 ${
                  userRating && star <= userRating.value ? "text-yellow-400" : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          {userRating && userRating.comment && <p className="text-gray-700">{userRating.comment}</p>}
          <p className="text-sm text-gray-500 mt-2">
            Dikirim pada {userRating && new Date(userRating.createdAt).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      )}

      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Semua Ulasan</h3>
        {ratings.length > 0 ? (
          ratings.map((rating) => (
            <div key={rating.id} className="border-b border-gray-200 pb-4 mb-4 last:border-0">
              <div className="flex justify-between mb-2">
                <div>
                  <p className="font-medium">{rating.user.name}</p>
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
              {rating.comment && <p className="text-gray-700">{rating.comment}</p>}
            </div>
          ))
        ) : (
          <p className="text-gray-500">Belum ada ulasan untuk produk ini.</p>
        )}
      </div>
    </div>
  );
} 