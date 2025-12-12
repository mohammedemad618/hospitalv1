import { NextRequest, NextResponse } from 'next/server';
import { performanceMonitor } from '@/lib/performance-monitor';

/**
 * Performance tracking middleware
 */
export function performanceMiddleware(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const startTime = Date.now();
  const url = new URL(request.url);
  const endpoint = url.pathname;
  const method = request.method;

  return handler(request).then((response) => {
    const duration = Date.now() - startTime;
    
    // Only track API routes
    if (endpoint.startsWith('/api/')) {
      performanceMonitor.record({
        endpoint,
        method,
        duration,
        timestamp: new Date(),
        statusCode: response.status,
      });
    }

    return response;
  });
}

