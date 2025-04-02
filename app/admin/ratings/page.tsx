"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Trash2, Edit, Star, X, Check } from "lucide-react";

interface Rating {
  id: string;
  value: number;
  comment: string | null;
  userId: string;
  productId: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
  };
}

export default function AdminRatingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState(0);
  const [editComment, setEditComment] = useState("");

  // Periksa autentikasi dan role
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user) {
      // Periksa role, asumsi informasi role ada di sesi
      if ((session.user as any).role !== "admin") {
        router.push("/");
      } else {
        fetchRatings();
      }
    }
  }, [status, session, router]);

  const fetchRatings = async () => {
    try {
      setIsLoading(true);
      // Fetch semua rating dari API admin khusus
      const response = await fetch("/api/admin/ratings");
      if (!response.ok) {
        throw new Error("Gagal memuat data rating");
      }
      const data = await response.json();
      setRatings(data.ratings);
    } catch (error) {
      console.error("Error fetching ratings:", error);
      setError("Terjadi kesalahan saat memuat data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus ulasan ini?")) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/ratings/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Gagal menghapus rating");
      }
      
      // Refresh data setelah berhasil
      fetchRatings();
    } catch (error) {
      console.error("Error deleting rating:", error);
      setError("Terjadi kesalahan saat menghapus ulasan");
    }
  };

  const startEditing = (rating: Rating) => {
    setEditingId(rating.id);
    setEditValue(rating.value);
    setEditComment(rating.comment || "");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValue(0);
    setEditComment("");
  };

  const saveEditing = async () => {
    if (!editingId) return;
    
    try {
      const response = await fetch(`/api/admin/ratings/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          value: editValue,
          comment: editComment,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Gagal menyimpan perubahan");
      }
      
      // Reset state dan refresh data
      setEditingId(null);
      fetchRatings();
    } catch (error) {
      console.error("Error updating rating:", error);
      setError("Terjadi kesalahan saat menyimpan perubahan");
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen py-12 bg-gray-50">
          <div className="container">
            <h1 className="text-3xl font-bold mb-8">Manajemen Ulasan</h1>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <p className="text-center py-8">Memuat data...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen py-12 bg-gray-50">
        <div className="container">
          <h1 className="text-3xl font-bold mb-8">Manajemen Ulasan</h1>
          
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
              {error}
            </div>
          )}
          
          <div className="bg-white p-8 rounded-xl shadow-sm">
            {ratings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left">Pengguna</th>
                      <th className="px-4 py-3 text-left">Produk</th>
                      <th className="px-4 py-3 text-center">Rating</th>
                      <th className="px-4 py-3 text-left">Komentar</th>
                      <th className="px-4 py-3 text-center">Tanggal</th>
                      <th className="px-4 py-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ratings.map((rating) => (
                      <tr key={rating.id} className="border-t border-gray-200">
                        <td className="px-4 py-3">{rating.user?.name || "Pengguna"}</td>
                        <td className="px-4 py-3">{rating.productId}</td>
                        <td className="px-4 py-3 text-center">
                          {editingId === rating.id ? (
                            <div className="flex justify-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setEditValue(star)}
                                  className="p-1"
                                >
                                  <Star 
                                    size={20} 
                                    className={star <= editValue ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
                                  />
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="flex justify-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star}
                                  size={20} 
                                  className={star <= rating.value ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
                                />
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {editingId === rating.id ? (
                            <textarea
                              value={editComment}
                              onChange={(e) => setEditComment(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              rows={2}
                            />
                          ) : (
                            <span>{rating.comment || "-"}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {new Date(rating.createdAt).toLocaleDateString("id-ID")}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {editingId === rating.id ? (
                            <div className="flex justify-center space-x-2">
                              <button
                                onClick={saveEditing}
                                className="p-1 text-green-600 hover:text-green-800"
                              >
                                <Check size={18} />
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="p-1 text-red-600 hover:text-red-800"
                              >
                                <X size={18} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-center space-x-2">
                              <button
                                onClick={() => startEditing(rating)}
                                className="p-1 text-blue-600 hover:text-blue-800"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(rating.id)}
                                className="p-1 text-red-600 hover:text-red-800"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center py-8">Belum ada data ulasan.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 