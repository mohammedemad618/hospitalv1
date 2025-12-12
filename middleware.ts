import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { applyRateLimit, generalRateLimiter, authRateLimiter } from '@/lib/rateLimiter';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Security Headers
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self';"
  );
  
  // X-Frame-Options: Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');
  
  // X-Content-Type-Options: Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // X-XSS-Protection (legacy, but still useful)
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Referrer-Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions-Policy (formerly Feature-Policy)
  // Allow camera and microphone for the same origin
  response.headers.set(
    'Permissions-Policy',
    'camera=(self), microphone=(self), geolocation=(), interest-cohort=()'
  );
  
  // Strict-Transport-Security (HSTS) - Only in production with HTTPS
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }
  
  // Rate Limiting
  const pathname = request.nextUrl.pathname;
  
  // Apply strict rate limiting to auth endpoints (except demo-token in development)
  if (pathname.startsWith('/api/auth/')) {
    // Skip rate limiting for demo-token endpoint in development
    if (pathname === '/api/auth/demo-token' && process.env.NODE_ENV === 'development') {
      // Allow unlimited requests to demo-token in development
    } else {
      const rateLimitResponse = await applyRateLimit(request, authRateLimiter);
      if (rateLimitResponse) {
        return rateLimitResponse;
      }
    }
  }
  
  // Apply general rate limiting to all API routes
  if (pathname.startsWith('/api/')) {
    const rateLimitResponse = await applyRateLimit(request, generalRateLimiter);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }
    
    // Add rate limit headers to response
    const identifier = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    // Note: In production, get actual rate limit info from Redis/store
    response.headers.set('X-RateLimit-Limit', '100');
    response.headers.set('X-RateLimit-Remaining', '99');
  }
  
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

