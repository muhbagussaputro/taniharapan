import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Hapus data lama untuk menghindari duplikasi
  await prisma.rating.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany();

  // Buat user demo
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user1 = await prisma.user.create({
    data: {
      name: 'Demo User',
      email: 'demo@example.com',
      password: hashedPassword,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Pak Tani',
      email: 'tani@example.com',
      password: hashedPassword,
    },
  });

  console.log('Seeding produk...');

  const productData = [
    {
      name: 'BioPlantz Nutrisi Tanaman',
      description: 'Nutrisi organik lengkap untuk semua jenis tanaman. Mempercepat pertumbuhan dan meningkatkan hasil panen hingga 40%. Aman untuk semua jenis tanaman.',
      price: 75000,
      image: '/vercel.svg',
    },
    {
      name: 'GrowMax Pupuk Organik',
      description: 'Pupuk organik premium yang kaya akan nutrisi esensial untuk pertumbuhan tanaman yang optimal. Dibuat dari bahan-bahan alami pilihan.',
      price: 120000,
      image: '/vercel.svg',
    },
    {
      name: 'AgroBoost Penguat Tanaman',
      description: 'Formula khusus untuk meningkatkan ketahanan tanaman terhadap hama dan penyakit. Sangat efektif untuk memperkuat sistem imun tanaman.',
      price: 95000,
      image: '/vercel.svg',
    },
    {
      name: 'HydroFresh Pelembab Tanah',
      description: 'Menjaga kelembaban tanah dan meningkatkan efisiensi penyerapan air untuk tanaman. Ideal untuk musim kemarau.',
      price: 85000,
      image: '/vercel.svg',
    },
  ];

  const products = [];
  
  for (const data of productData) {
    const product = await prisma.product.create({
      data
    });
    products.push(product);
  }

  // Buat ratings
  await prisma.rating.create({
    data: {
      userId: user1.id,
      productId: products[0].id,
      value: 5,
      comment: 'Produk sangat bagus, tanaman saya tumbuh subur!'
    },
  });

  await prisma.rating.create({
    data: {
      userId: user2.id,
      productId: products[0].id,
      value: 4,
      comment: 'Cukup bagus, tapi harganya sedikit mahal.'
    },
  });

  await prisma.rating.create({
    data: {
      userId: user1.id,
      productId: products[1].id,
      value: 5,
      comment: 'Sangat memuaskan, hasil panen meningkat signifikan.'
    },
  });

  console.log('Data seed berhasil ditambahkan!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 