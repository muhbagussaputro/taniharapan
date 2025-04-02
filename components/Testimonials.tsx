"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import Image from "next/image";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Pak Bambang",
      role: "Petani Sayur, Bandung",
      image: "/vercel.svg",
      testimonial:
        "Sejak menggunakan produk Naturagen, hasil panen sayur saya meningkat hingga 40%. Kualitas sayuran lebih baik dan tahan lama. Sangat merekomendasikan!",
    },
    {
      id: 2,
      name: "Ibu Dewi",
      role: "Petani Buah, Malang",
      image: "/vercel.svg",
      testimonial:
        "Buah-buahan saya tumbuh lebih cepat dan berkualitas sejak menggunakan Naturagen. Pelayanan konsultasi juga sangat membantu.",
    },
    {
      id: 3,
      name: "Pak Ahmad",
      role: "Petani Padi, Cianjur",
      image: "/vercel.svg",
      testimonial:
        "Panen padi saya meningkat hingga 30% dengan menggunakan produk Naturagen. Proses penanaman juga lebih mudah dan tanaman lebih tahan hama.",
    }
  ];

  return (
    <LazyMotion features={domAnimation}>
      <section className="py-20 bg-white" id="testimonials">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Apa Kata <span className="text-primary-600">Pelanggan Kami</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pengalaman nyata dari para petani yang telah menggunakan produk kami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <m.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow relative"
              >
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="inline w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700">"{testimonial.testimonial}"</p>
                <div className="absolute -z-10 text-primary-100 right-4 bottom-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="80"
                    height="80"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M12 12a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1h-1.388c0-.351.021-.703.062-1.054.062-.372.166-.703.31-.992.145-.29.331-.517.559-.683.227-.186.516-.279.868-.279V3c-.579 0-1.085.124-1.52.372a3.322 3.322 0 0 0-1.085.992 4.92 4.92 0 0 0-.62 1.458A7.712 7.712 0 0 0 9 7.558V11a1 1 0 0 0 1 1h2Zm-6 0a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1H4.612c0-.351.021-.703.062-1.054.062-.372.166-.703.31-.992.145-.29.331-.517.559-.683.227-.186.516-.279.868-.279V3c-.579 0-1.085.124-1.52.372a3.322 3.322 0 0 0-1.085.992 4.92 4.92 0 0 0-.62 1.458A7.712 7.712 0 0 0 3 7.558V11a1 1 0 0 0 1 1h2Z" />
                  </svg>
                </div>
              </m.div>
            ))}
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}
