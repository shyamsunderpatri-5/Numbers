import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * NUMERIQ.AI - Security: Rate Limiting
 * Uses Upstash Redis for high-performance edge-based throttling.
 */

// Initialize Redis client
// Note: These env vars must be set in production
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// 1. Auth Rate Limiter (Brute-force protection)
// 5 attempts per 15 minutes per IP
export const authRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  analytics: true,
  prefix: "@numeriq/auth",
});

// 2. Global API Rate Limiter
// 100 requests per minute per IP
export const globalRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(100, "1 m"),
  analytics: true,
  prefix: "@numeriq/global",
});

// 3. AI Generation Rate Limiter (Preventing token burnout)
// 10 readings per hour per user
export const aiRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "1 h"),
  analytics: true,
  prefix: "@numeriq/ai",
});
