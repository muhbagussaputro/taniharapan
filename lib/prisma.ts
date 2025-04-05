import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Alternatif connection string langsung untuk production
const productionDatabaseUrl = "postgresql://neondb_owner:npg_QTjkUvqD24PF@ep-super-frost-a1y0w75e-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

// Gunakan env variable jika ada, atau fallback ke hardcoded URL untuk production
const databaseUrl = process.env.NODE_ENV === 'production' 
  ? (process.env.DATABASE_URL || productionDatabaseUrl)
  : process.env.DATABASE_URL;

// Debugging
if (process.env.NODE_ENV === 'production') {
  console.log('Using database connection:', databaseUrl ? 'From environment' : 'Hardcoded fallback');
  console.log('Database URL pattern:', databaseUrl?.substring(0, 20) + '...');
}

// Prisma client dengan opsi koneksi yang lebih toleran
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    // Opsi koneksi tambahan untuk tolerance
    // @ts-ignore - Prisma akan mengabaikan yang tidak dikenal
    __internal: {
      engine: {
        connectionTimeout: 10000, // 10 detik
        pollInterval: 500,
        retry: {
          attempts: 5,
          backoff: {
            type: 'exponential',
            factor: 2,
            maxWait: 5000,
          },
        },
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma; 