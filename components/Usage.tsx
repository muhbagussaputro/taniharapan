"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import Image from "next/image";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Usage() {
  const steps = [
    {
      number: "01",
      title: "Pilih Produk",
      description: "Pilih produk Naturagen yang sesuai dengan kebutuhan tanaman Anda."
    },
    {
      number: "02",
      title: "Ikuti Petunjuk",
      description: "Gunakan sesuai dengan petunjuk penggunaan pada kemasan."
    },
    {
      number: "03",
      title: "Aplikasikan Secara Rutin",
      description: "Gunakan secara rutin sesuai jadwal untuk hasil yang maksimal."
    },
  ];

  return (
    <LazyMotion features={domAnimation}>
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cara Penggunaan <span className="text-primary-600">Produk Kami</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ikuti langkah-langkah ini untuk mendapatkan hasil pertanian terbaik
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <m.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="rounded-xl overflow-hidden shadow-md"
            >
              <Image
                src="https://dummyimage.com/600x500/4CAF50/fff&text=Cara+Penggunaan"
                alt="Cara penggunaan produk Naturagen"
                width={600}
                height={500}
                className="w-full h-auto"
              />
            </m.div>

            <div className="space-y-8">
              {steps.map((step, index) => (
                <m.div
                  key={step.number}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  transition={{ delay: index * 0.2 }}
                  className="flex"
                >
                  <div className="mr-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 font-bold">
                      {step.number}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </m.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
} 