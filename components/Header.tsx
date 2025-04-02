"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/vercel.svg" alt="Naturagen" width={40} height={40} />
          <span className="text-xl font-bold text-primary-600">Naturagen</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link
            href="/"
            className={`text-sm font-medium ${
              pathname === "/" ? "text-primary-600" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Beranda
          </Link>
          <Link
            href="/#products"
            className={`text-sm font-medium ${
              pathname === "/#products" ? "text-primary-600" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Produk
          </Link>
          <Link
            href="/#testimonials"
            className={`text-sm font-medium ${
              pathname === "/#testimonials" ? "text-primary-600" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Testimoni
          </Link>
          <Link
            href="/#contact"
            className={`text-sm font-medium ${
              pathname === "/#contact" ? "text-primary-600" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Kontak
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {session ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Halo, {session.user?.name}</span>
              <button
                onClick={() => signOut()}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Keluar
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
                Masuk
              </Link>
              <Link href="/register" className="btn btn-primary">
                Daftar
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-600 hover:text-gray-900"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container py-4 space-y-4">
            <Link
              href="/"
              className={`block text-sm font-medium ${
                pathname === "/" ? "text-primary-600" : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Beranda
            </Link>
            <Link
              href="/#products"
              className={`block text-sm font-medium ${
                pathname === "/#products" ? "text-primary-600" : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Produk
            </Link>
            <Link
              href="/#testimonials"
              className={`block text-sm font-medium ${
                pathname === "/#testimonials" ? "text-primary-600" : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Testimoni
            </Link>
            <Link
              href="/#contact"
              className={`block text-sm font-medium ${
                pathname === "/#contact" ? "text-primary-600" : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Kontak
            </Link>
            <div className="pt-4 border-t">
              {session ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">Halo, {session.user?.name}</p>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Keluar
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    className="block text-sm text-gray-600 hover:text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    className="block w-full btn btn-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 