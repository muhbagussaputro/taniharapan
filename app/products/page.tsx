import Image from 'next/image';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const prisma = new PrismaClient();

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        ratings: {
          select: {
            value: true,
          },
        },
      },
    });
    
    return products.map(product => ({
      ...product,
      averageRating: product.ratings.length > 0 
        ? product.ratings.reduce((acc, rating) => acc + rating.value, 0) / product.ratings.length 
        : 0,
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <>
      <Header />
      <main className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">Semua Produk</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <Link 
                  href={`/produk/${product.id}`} 
                  key={product.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
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
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-lg text-gray-500">Belum ada produk tersedia.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 