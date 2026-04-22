/**
 * NUMERIQ.AI — Sage Library Retriever
 * Implements semantic vector search using Xenova Transformers.
 */

import { pipeline } from "@xenova/transformers";
import { supabase } from "../../supabase/client";
import { LibrarySnippet } from "../types";

let embedder: any = null;

/**
 * Singleton to cache the embedding model in memory.
 */
async function getEmbedder() {
  if (!embedder) {
    console.log("🕯️ Awakening the Sage (Loading Embedding Model)...");
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedder;
}

/**
 * Retrieves the most contextually relevant snippets from the ancient archives.
 */
export async function retrieveLibraryWisdom(
  query: string, 
  count: number = 3
): Promise<LibrarySnippet[]> {
  try {
    const generator = await getEmbedder();
    
    // Generate embedding for the query
    const output = await generator(query, { pooling: "mean", normalize: true });
    const embedding = Array.from(output.data);

    // Call Supabase RPC for vector similarity search
    const { data, error } = await supabase.rpc("match_library_documents", {
      query_embedding: embedding,
      match_threshold: 0.4, // Slightly lower threshold to ensure we get depth
      match_count: count
    });

    if (error) {
      console.error("Sage Retrieval Error:", error.message);
      return [];
    }

    return data as LibrarySnippet[];
  } catch (err) {
    console.warn("Library retrieval skipped due to engine error:", err);
    return [];
  }
}
