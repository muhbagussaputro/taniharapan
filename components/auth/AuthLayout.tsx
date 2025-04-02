"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  altLink: string;
  altText: string;
  isRegister?: boolean;
}

export default function AuthLayout({
  children,
  title,
  subtitle,
  altLink,
  altText,
  isRegister = false,
}: AuthLayoutProps) {
  const slideVariants = {
    hidden: { x: isRegister ? -50 : 50, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.3
      }
    },
    exit: { 
      x: isRegister ? 50 : -50, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const decorationVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.2,
        duration: 0.5
      }
    }
  };

  return (
    <>
      <Header />
      <LazyMotion features={domAnimation}>
        <main className="py-16 bg-gray-50 min-h-screen">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-8">
              <m.div 
                className="hidden md:flex md:w-1/2 bg-primary-600 rounded-2xl p-10 text-white justify-center items-center relative overflow-hidden"
                initial="hidden"
                animate="visible"
                variants={decorationVariants}
              >
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-500 rounded-full opacity-20"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary-500 rounded-full opacity-20"></div>
                <div className="relative z-10 text-center">
                  <div className="flex justify-center mb-6">
                    <Image 
                      src="/vercel.svg" 
                      alt="Naturagen Logo" 
                      width={80} 
                      height={80} 
                      className="bg-white p-3 rounded-full"
                    />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Naturagen</h2>
                  <p className="text-primary-100 mb-8 max-w-md">
                    Solusi pertanian organik terbaik untuk hasil panen yang melimpah dan ramah lingkungan.
                  </p>
                  <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <div key={num} className="aspect-square bg-primary-500/30 rounded-lg flex items-center justify-center">
                        <Image 
                          src="/vercel.svg" 
                          alt={`Product ${num}`} 
                          width={30} 
                          height={30} 
                          className="opacity-70"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </m.div>

              <m.div 
                className="md:w-1/2 bg-white p-8 md:p-10 rounded-2xl shadow-sm"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={slideVariants}
              >
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{title}</h1>
                <p className="text-gray-600 mb-8">{subtitle}</p>
                
                {children}
                
                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-600">
                    {altText}{" "}
                    <Link 
                      href={altLink} 
                      className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                    >
                      {isRegister ? "Masuk sekarang" : "Daftar sekarang"}
                    </Link>
                  </p>
                </div>
              </m.div>
            </div>
          </div>
        </main>
      </LazyMotion>
      <Footer />
    </>
  );
} 