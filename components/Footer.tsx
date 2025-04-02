"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8" id="contact">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-6">
              <Image src="/vercel.svg" alt="Naturagen" width={40} height={40} />
              <span className="text-xl font-bold ml-2">Naturagen</span>
            </div>
            <p className="text-gray-400 mb-6">
              Solusi pertanian organik terbaik untuk hasil panen yang melimpah dan
              ramah lingkungan.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-primary-600 transition-colors"
              >
                <Facebook size={18} />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-primary-600 transition-colors"
              >
                <Instagram size={18} />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-primary-600 transition-colors"
              >
                <Twitter size={18} />
              </Link>
              <Link
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-primary-600 transition-colors"
              >
                <Youtube size={18} />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Halaman</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/#products"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Produk
                </Link>
              </li>
              <li>
                <Link
                  href="/#testimonials"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Testimoni
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Kontak Kami</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Phone size={18} className="text-primary-500 mr-3 mt-1" />
                <span className="text-gray-400">+62 812 3456 7890</span>
              </li>
              <li className="flex items-start">
                <Mail size={18} className="text-primary-500 mr-3 mt-1" />
                <span className="text-gray-400">info@naturagen.id</span>
              </li>
              <li className="flex items-start">
                <MapPin size={18} className="text-primary-500 mr-3 mt-1" />
                <span className="text-gray-400">
                  Jl. Agro Industri No. 123, Bogor, Jawa Barat, Indonesia
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Hubungi Kami</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // Logika pengiriman form bisa ditambahkan di sini
                const form = e.target as HTMLFormElement;
                const name = (form.elements.namedItem("name") as HTMLInputElement).value;
                const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value;
                window.open(
                  `https://wa.me/6281234567890?text=Halo%20Naturagen,%20saya%20${encodeURIComponent(
                    name
                  )}%20ingin%20bertanya%20tentang%20produk%20Anda.%20${encodeURIComponent(
                    message
                  )}`,
                  "_blank"
                );
              }}
              className="space-y-4"
            >
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Nama Anda"
                  className="w-full bg-gray-800 rounded p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <textarea
                  name="message"
                  placeholder="Pesan Anda"
                  rows={3}
                  className="w-full bg-gray-800 rounded p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded transition-colors"
              >
                Kirim Pesan
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Naturagen. Hak Cipta Dilindungi.
            </p>
            <div className="flex space-x-6">
              <Link
                href="/privacy-policy"
                className="text-gray-500 hover:text-gray-400 text-sm"
              >
                Kebijakan Privasi
              </Link>
              <Link
                href="/terms-of-service"
                className="text-gray-500 hover:text-gray-400 text-sm"
              >
                Syarat & Ketentuan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 