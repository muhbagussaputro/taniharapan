"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export default function AdminHeader() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-emerald-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/admin" className="text-xl font-bold">
              Admin Panel
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/admin" 
              className="hover:text-emerald-300 transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              href="/admin/ratings" 
              className="hover:text-emerald-300 transition-colors"
            >
              Kelola Rating
            </Link>
            <Link 
              href="/" 
              className="hover:text-emerald-300 transition-colors"
            >
              Lihat Website
            </Link>
            {session?.user && (
              <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition-colors"
              >
                Logout
              </button>
            )}
          </nav>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mt-3 md:hidden">
            <nav className="flex flex-col space-y-3 pb-3">
              <Link 
                href="/admin" 
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-emerald-300 transition-colors py-2"
              >
                Dashboard
              </Link>
              <Link 
                href="/admin/ratings" 
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-emerald-300 transition-colors py-2"
              >
                Kelola Rating
              </Link>
              <Link 
                href="/" 
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-emerald-300 transition-colors py-2"
              >
                Lihat Website
              </Link>
              {session?.user && (
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition-colors text-left"
                >
                  Logout
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 