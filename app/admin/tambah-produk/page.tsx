"use client";

import { useState } from "react";
import ProductImageUpload from "@/components/ProductImageUpload";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2 } from "lucide-react";

export default function TambahProdukPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageData, setImageData] = useState<{ url: string; public_id: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !description || !price || !imageData) {
      setError("Semua field harus diisi");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      // Contoh implementasi: panggil API untuk menyimpan produk
      // const response = await fetch("/api/products", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     name,
      //     description,
      //     price: parseInt(price),
      //     image: imageData.url,
      //     image_public_id: imageData.public_id,
      //   }),
      // });
      
      // if (!response.ok) {
      //   throw new Error("Gagal menyimpan produk");
      // }
      
      // Simulasi penundaan
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      
      // Reset form setelah beberapa detik
      setTimeout(() => {
        setName("");
        setDescription("");
        setPrice("");
        setImageData(null);
        setSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error(err);
      setError("Gagal menyimpan produk. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl font-bold mb-8">Tambah Produk Baru</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-8">
            {success ? (
              <div className="bg-green-50 border border-green-200 p-4 rounded-md text-green-700 mb-6 text-center">
                Produk berhasil ditambahkan!
              </div>
            ) : null}
            
            {error ? (
              <div className="bg-red-50 border border-red-200 p-4 rounded-md text-red-700 mb-6">
                {error}
              </div>
            ) : null}
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Produk
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Contoh: BioPlantz Nutrisi Tanaman"
                      disabled={loading}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                      Harga (Rp)
                    </label>
                    <input
                      type="number"
                      id="price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Contoh: 75000"
                      disabled={loading}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Deskripsi Produk
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows={5}
                      placeholder="Jelaskan detail produk..."
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <div>
                  <ProductImageUpload
                    onImageUploaded={(data) => setImageData(data)}
                    className="mb-6"
                  />
                  
                  {imageData && (
                    <div className="text-sm text-gray-500 mb-8">
                      <p>URL Gambar: {imageData.url.substring(0, 50)}...</p>
                      <p>Public ID: {imageData.public_id.substring(0, 50)}...</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary py-3 px-6 w-full md:w-auto"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Menyimpan...
                    </span>
                  ) : (
                    "Simpan Produk"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 