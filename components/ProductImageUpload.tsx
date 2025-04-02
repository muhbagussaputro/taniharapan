"use client";

import { useState } from "react";
import { Camera, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { uploadProductImage } from "@/utils/cloudinary";

interface ProductImageUploadProps {
  onImageUploaded: (imageData: { url: string; public_id: string }) => void;
  className?: string;
}

export default function ProductImageUpload({
  onImageUploaded,
  className = "",
}: ProductImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi tipe file
    if (!file.type.includes("image/")) {
      setError("File harus berupa gambar");
      return;
    }

    // Validasi ukuran file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 5MB");
      return;
    }

    try {
      setError("");
      setUploading(true);

      // Tampilkan preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Upload ke Cloudinary
      const imageData = await uploadProductImage(file);
      
      // Panggil callback dengan data gambar
      onImageUploaded(imageData);
      
      // Bersihkan preview saat berhasil
      URL.revokeObjectURL(previewUrl);
      setPreview(imageData.url);
    } catch (err) {
      console.error(err);
      setError("Gagal mengunggah gambar");
      // Jika gagal, pertahankan preview
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Gambar Produk
      </label>

      {preview ? (
        <div className="relative rounded-lg overflow-hidden mb-2 w-full h-48">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={() => setPreview(null)}
            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
            disabled={uploading}
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition-colors ${
            uploading ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-2" />
              <p className="text-sm text-gray-500">Mengunggah gambar...</p>
            </>
          ) : (
            <>
              <Camera className="w-10 h-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 text-center">
                Klik untuk unggah gambar produk
                <br />
                <span className="text-xs">Format: JPG, PNG, WebP (Maks. 5MB)</span>
              </p>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            disabled={uploading}
          />
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
} 