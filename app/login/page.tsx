"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import { AnimatePresence, m } from "framer-motion";

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Set success message if redirected from register page
  useState(() => {
    if (success === "account-created") {
      setSuccessMessage("Akun berhasil dibuat. Silakan masuk.");
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Email atau password salah");
        setIsLoading(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
      setError("Terjadi kesalahan, silakan coba lagi");
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Masuk ke Akun Anda"
      subtitle="Selamat datang kembali! Silakan masuk untuk mengakses akun Anda."
      altLink="/register"
      altText="Belum memiliki akun?"
    >
      <AnimatePresence mode="wait">
        {successMessage && (
          <m.div 
            className="bg-green-50 text-green-700 p-4 rounded-md mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {successMessage}
          </m.div>
        )}

        {error && (
          <m.div 
            className="bg-red-50 text-red-700 p-4 rounded-md mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {error}
          </m.div>
        )}
      </AnimatePresence>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
            placeholder="nama@email.com"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input pr-10"
              placeholder="Masukkan password"
            />
          </div>
          <div className="flex justify-end mt-1">
            <button type="button" className="text-xs text-primary-600 hover:text-primary-700">
              Lupa password?
            </button>
          </div>
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn btn-primary py-3"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
              </span>
            ) : "Masuk"}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
} 