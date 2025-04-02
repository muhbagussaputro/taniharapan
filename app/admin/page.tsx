"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AdminHeader from '../components/AdminHeader';
import Footer from '../components/Footer';
import Link from 'next/link';
import { ClipboardList, Users, ShoppingBag } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdminRole() {
      try {
        if (status === 'authenticated' && session?.user) {
          // Cek apakah pengguna memiliki role admin
          const response = await fetch('/api/me');
          if (response.ok) {
            const userData = await response.json();
            if (userData.user?.role === 'admin') {
              setIsAdmin(true);
            } else {
              // Bukan admin, redirect ke home
              router.push('/');
            }
          } else {
            router.push('/');
          }
        } else if (status === 'unauthenticated') {
          // Belum login, redirect ke login
          router.push('/login');
        }
        setLoading(false);
      } catch (error) {
        console.error("Error checking admin role:", error);
        router.push('/');
      }
    }

    checkAdminRole();
  }, [status, session, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Router akan mengarahkan, jadi tidak perlu render apa pun
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-emerald-800">Dashboard Admin</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Menu Kelola Rating */}
          <Link 
            href="/admin/ratings"
            className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow border-l-4 border-emerald-500"
          >
            <div className="flex items-center">
              <ClipboardList className="h-8 w-8 text-emerald-600 mr-4" />
              <div>
                <h2 className="text-xl font-semibold">Kelola Rating</h2>
                <p className="text-gray-600 mt-1">Mengelola rating dan ulasan pengguna</p>
              </div>
            </div>
          </Link>
          
          {/* Menu Kelola Pengguna */}
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500 opacity-70">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <h2 className="text-xl font-semibold">Kelola Pengguna</h2>
                <p className="text-gray-600 mt-1">Segera Hadir</p>
              </div>
            </div>
          </div>
          
          {/* Menu Kelola Produk */}
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow border-l-4 border-purple-500 opacity-70">
            <div className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-purple-600 mr-4" />
              <div>
                <h2 className="text-xl font-semibold">Kelola Produk</h2>
                <p className="text-gray-600 mt-1">Segera Hadir</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Informasi Admin</h2>
          <p className="mb-2">
            <span className="font-semibold">Email:</span> {session?.user?.email}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Nama:</span> {session?.user?.name}
          </p>
          <p className="text-gray-600 mt-4">
            Selamat datang di panel admin Tani Harapan. Di sini Anda dapat mengelola berbagai aspek website.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 