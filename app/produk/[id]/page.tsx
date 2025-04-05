"use client";

import { useState, useEffect, useCallback } from "react";
import React from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RatingDisplay from "@/components/RatingDisplay";
import RatingForm from "@/components/RatingForm";
import CloudinaryImage from "@/components/CloudinaryImage";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Definisikan tipe untuk produk
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

// Produk dummy (akan diganti dengan data dari database)
const productsStatic: Product[] = [
  {
    id: "1",
    name: "BioPlantz Nutrisi Tanaman",
    description: "Nutrisi organik terbaik untuk tanaman Anda, meningkatkan pertumbuhan dan hasil panen hingga 40%.",
    price: 75000,
    image: "https://via.placeholder.com/600x400?text=Nutrisi+Tanaman"
  },
  {
    id: "2",
    name: "GrowMax Pupuk Organik",
    description: "Pupuk organik premium yang memperkaya tanah dan menyediakan nutrisi essensial untuk tanaman.",
    price: 85000,
    image: "https://via.placeholder.com/600x400?text=Pupuk+Organik"
  },
  {
    id: "3",
    name: "AgroBoost Penguat Tanaman",
    description: "Formula khusus untuk memperkuat sistem imun tanaman dan mencegah hama serta penyakit.",
    price: 95000,
    image: "https://via.placeholder.com/600x400?text=Penguat+Tanaman"
  },
  {
    id: "4",
    name: "HydroFresh Pelembab Tanah",
    description: "Menjaga kelembaban tanah optimal untuk pertumbuhan tanaman yang sehat dan berkelanjutan.",
    price: 65000,
    image: "https://via.placeholder.com/600x400?text=Pelembab+Tanah"
  }
];

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [product, setProduct] = useState<Product | null>(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [canRate, setCanRate] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);

  // Ekstrak ID produk dari params di fungsi terpisah
  useEffect(() => {
    const getProductId = async () => {
      try {
        const resolvedParams = await Promise.resolve(params);
        if (resolvedParams?.id) {
          setProductId(resolvedParams.id);
        }
      } catch (error) {
        console.error("Error resolving params:", error);
        router.push('/produk');
      }
    };
    
    getProductId();
  }, [params, router]);

  // Fungsi untuk mengambil data produk dan rating
  const fetchProductData = useCallback(async () => {
    if (!productId) return;
    
    // Ambil data produk
    const foundProduct = productsStatic.find(p => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      router.push('/produk');
      return;
    }
    
    // Ambil ratings
    try {
      const response = await fetch(`/api/ratings?productId=${productId}`);
      if (response.ok) {
        const data = await response.json();
        setRatings(data.ratings || []);
      }
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
    
    setLoading(false);
  }, [productId, router]);
  
  // Load data ketika productId tersedia
  useEffect(() => {
    if (productId) {
      fetchProductData();
    }
  }, [productId, fetchProductData]);

  // Cek peran user saat status autentikasi berubah
  useEffect(() => {
    const checkUserRole = async () => {
      if (status === "authenticated" && session?.user) {
        try {
          const response = await fetch('/api/me');
          if (response.ok) {
            const data = await response.json();
            setCanRate(data.user?.role === "admin" || data.user?.role === "rater");
          }
        } catch (error) {
          console.error("Error checking user role:", error);
        }
      }
    };
    
    checkUserRole();
  }, [status, session]);
  
  const handleRatingSuccess = () => {
    setRatingSubmitted(true);
    if (productId) {
      // Perbarui rating setelah submit
      fetchProductData();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Produk tidak ditemukan</p>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 relative">
              <div className="aspect-w-4 aspect-h-3">
                <CloudinaryImage 
                  src={product.image} 
                  alt={product.name}
                  width={600}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            
            <div className="md:w-1/2 p-6">
              <h1 className="text-3xl font-bold text-emerald-800 mb-4">{product.name}</h1>
              
              <div className="mb-4">
                <p className="text-2xl font-semibold text-emerald-700">
                  {formatPrice(product.price)}
                </p>
              </div>
              
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2 text-gray-700">Deskripsi Produk</h2>
                <p className="text-gray-600">{product.description}</p>
              </div>
              
              <div className="flex flex-col space-y-3">
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors w-full md:w-auto">
                  Tambah ke Keranjang
                </button>
                
                <button className="bg-white border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-semibold py-3 px-6 rounded-lg transition-colors w-full md:w-auto">
                  Beli Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Rating dan Ulasan */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-emerald-800 mb-6">Rating dan Ulasan</h2>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Display Ratings */}
            {ratings && ratings.length > 0 ? (
              <div className="mb-10">
                <RatingDisplay ratings={ratings} />
              </div>
            ) : (
              <p className="text-gray-500 mb-8">Belum ada ulasan untuk produk ini.</p>
            )}
            
            {/* Form Rating */}
            {status === "authenticated" ? (
              canRate ? (
                ratingSubmitted ? (
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <p className="text-emerald-700">Terima kasih atas ulasan Anda!</p>
                  </div>
                ) : (
                  <RatingForm 
                    productId={productId} 
                    onSuccess={handleRatingSuccess} 
                  />
                )
              ) : (
                <p className="text-gray-500">Anda tidak memiliki izin untuk memberikan rating.</p>
              )
            ) : (
              <p className="text-gray-500">
                Silakan <a href="/login" className="text-emerald-600 hover:underline">login</a> untuk memberikan ulasan.
              </p>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 