"use client";

import { useState, useEffect } from "react";
import React from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RatingDisplay from "@/components/RatingDisplay";
import RatingForm from "@/components/RatingForm";
import CloudinaryImage from "@/components/CloudinaryImage";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Produk dummy (akan diganti dengan data dari database)
const productsStatic = [
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

export default function ProductDetailPage({ params }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [product, setProduct] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [canRate, setCanRate] = useState(false);

  useEffect(() => {
    // Menggunakan React.use() untuk unwrap params
    const paramsData = React.use(Promise.resolve(params));
    if (!paramsData?.id) return;
    
    const productId = paramsData.id;
    
    // Ambil data produk
    const foundProduct = productsStatic.find(p => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      router.push('/produk');
    }
    
    // Ambil ratings
    fetchRatings(productId);
    
    // Cek peran user
    if (status === "authenticated" && session?.user) {
      checkUserRole();
    }
    
    setLoading(false);
  }, [params, router, status, session]);
  
  const fetchRatings = async (productId) => {
    try {
      const response = await fetch(`/api/ratings?productId=${productId}`);
      if (response.ok) {
        const data = await response.json();
        setRatings(data.ratings || []);
      }
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };
  
  const checkUserRole = async () => {
    try {
      const response = await fetch('/api/me');
      if (response.ok) {
        const data = await response.json();
        setCanRate(data.user?.role === "admin" || data.user?.role === "rater");
      }
    } catch (error) {
      console.error("Error checking user role:", error);
    }
  };
  
  const handleRatingSuccess = () => {
    setRatingSubmitted(true);
    const paramsData = React.use(Promise.resolve(params));
    if (paramsData?.id) {
      fetchRatings(paramsData.id);
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
                  <div className="border-t pt-8">
                    <h3 className="text-xl font-semibold mb-4">Berikan Ulasan</h3>
                    <RatingForm productId={params.id} onSuccess={handleRatingSuccess} />
                  </div>
                )
              ) : (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-yellow-700">Anda tidak memiliki izin untuk memberikan ulasan. Hanya admin dan pengguna dengan peran 'rater' yang dapat memberikan ulasan.</p>
                </div>
              )
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">Anda harus <a href="/login" className="text-emerald-600 font-semibold">login</a> untuk memberikan ulasan</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 