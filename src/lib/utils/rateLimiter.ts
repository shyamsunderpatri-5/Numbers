import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory store for rate limiting (note: resets on serverless cold starts)
// For true global rate limiting, use Upstash Redis.
const rateLimitStore = new Map<string, { count: number; expiresAt: number }>();

export function checkRateLimit(request: NextRequest, endpoint: string, limit: number, windowMs: number = 60000) {
    const ip = request.headers.get('x-forwarded-for') || request.ip || '127.0.0.1';
    const key = `${endpoint}:${ip}`;
    const now = Date.now();

    const record = rateLimitStore.get(key);

    if (record) {
        if (now > record.expiresAt) {
            // Window expired, reset
            rateLimitStore.set(key, { count: 1, expiresAt: now + windowMs });
            return null;
        }

        if (record.count >= limit) {
            return NextResponse.json(
                { error: "Too Many Requests", message: `Rate limit exceeded for ${endpoint}. Please try again later.` },
                { status: 429, headers: { 'Retry-After': Math.ceil((record.expiresAt - now) / 1000).toString() } }
            );
        }

        record.count += 1;
        rateLimitStore.set(key, record);
    } else {
        rateLimitStore.set(key, { count: 1, expiresAt: now + windowMs });
    }

    return null; // Null means passed
}
