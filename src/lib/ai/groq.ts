/**
 * NUMERIQ.AI - Groq Client Configuration
 * Using standard Groq SDK for high-performance inference.
 */

import Groq from "groq-sdk";

if (!process.env.GROQ_API_KEY) {
  throw new Error("Missing GROQ_API_KEY environment variable");
}

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Model constants for the system
 */
export const MODELS = {
  PREMIUM: "llama-3.3-70b-versatile", // Primary high-quality model
  FAST: "llama-3.1-8b-instant",        // Fallback or testing model
};
