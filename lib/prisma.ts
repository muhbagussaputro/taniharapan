import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Alternatif connection string langsung untuk production
const productionDatabaseUrl = "postgresql://neondb_owner:npg_QTjkUvqD24PF@ep-mute-union-a1v63gb0-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

// Gunakan env variable jika ada, atau fallback ke hardcoded URL untuk production
const databaseUrl = process.env.NODE_ENV === 'production' 
  ? (process.env.DATABASE_URL || productionDatabaseUrl)
  : process.env.DATABASE_URL;

// Debugging
if (process.env.NODE_ENV === 'production') {
  console.log('Using database connection:', databaseUrl ? 'From environment' : 'Hardcoded fallback');
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma; 