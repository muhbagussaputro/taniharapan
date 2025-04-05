import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Log informasi request
  console.log('Request path:', request.nextUrl.pathname);

  // API debugging
  if (request.nextUrl.pathname.startsWith('/api/')) {
    console.log('API Request headers:', Object.fromEntries(request.headers));
  }

  // Khusus debugging endpoint register
  if (request.nextUrl.pathname === '/api/register') {
    console.log('Register request received');
  }

  return NextResponse.next();
}

// Konfigurasi path yang akan diproses middleware
export const config = {
  matcher: [
    '/api/:path*',
  ],
} 