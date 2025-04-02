import Image from 'next/image';
import Link from 'next/link';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CloudinaryImage from "@/components/CloudinaryImage";

// Data produk sementara
const products = [
  {
    id: "1",
    name: "BioPlantz Nutrisi Tanaman",
    description: "Nutrisi organik lengkap untuk semua jenis tanaman. Mempercepat pertumbuhan dan meningkatkan hasil panen hingga 40%. Aman untuk semua jenis tanaman.",
    price: 75000,
    image: "https://dummyimage.com/600x400/4CAF50/fff&text=Nutrisi+Tanaman",
    averageRating: 4.5,
  },
  {
    id: "2",
    name: "GrowMax Pupuk Organik",
    description: "Pupuk organik premium yang kaya akan nutrisi esensial untuk pertumbuhan tanaman yang optimal. Dibuat dari bahan-bahan alami pilihan.",
    price: 120000,
    image: "https://dummyimage.com/600x400/2196F3/fff&text=Pupuk+Organik",
    averageRating: 4.2,
  },
  {
    id: "3",
    name: "AgroBoost Penguat Tanaman",
    description: "Formula khusus untuk meningkatkan ketahanan tanaman terhadap hama dan penyakit. Sangat efektif untuk memperkuat sistem imun tanaman.",
    price: 95000,
    image: "https://dummyimage.com/600x400/FFC107/000&text=Penguat+Tanaman",
    averageRating: 4.7,
  },
  {
    id: "4",
    name: "HydroFresh Pelembab Tanah",
    description: "Menjaga kelembaban tanah dan meningkatkan efisiensi penyerapan air untuk tanaman. Ideal untuk musim kemarau.",
    price: 85000,
    image: "https://dummyimage.com/600x400/9C27B0/fff&text=Pelembab+Tanah",
    averageRating: 4.3,
  },
];

export default function ProductsPage() {
  return (
    <>
      <Header />
      <main className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">Semua Produk</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <Link 
                href={`/produk/${product.id}`} 
                key={product.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 w-full">
                  <CloudinaryImage
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority={index < 4}
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold">{product.name}</h2>
                  <p className="text-gray-600 line-clamp-2 my-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-lg">Rp {product.price.toLocaleString('id-ID')}</p>
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span>{product.averageRating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 