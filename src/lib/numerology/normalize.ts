/**
 * NUMERIQ.AI - Name Normalization
 * Strictly follows Chaldean normalization rules.
 */

export function normalizeName(name: string): string {
  if (!name) return "";

  // 1. Convert to UPPERCASE
  let normalized = name.toUpperCase();

  // 2. NFD normalize + strip diacritics (José -> JOSE, Müller -> MULLER)
  normalized = normalized.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // 3. Remove all non-letter characters EXCEPT spaces and hyphens
  // 4. Spaces and hyphens are preserved as separators
  normalized = normalized.replace(/[^A-Z\s-]/g, "");

  // 5. Trim extra spaces
  normalized = normalized.trim().replace(/\s+/g, " ");

  return normalized;
}

/**
 * Security: Prevents LLM Prompt Injection via User Name.
 * Replaces potential instruction-related keywords and symbols.
 */
export function sanitizeForPrompt(name: string): string {
  const normalized = normalizeName(name);
  // Remove common injection syntax
  return normalized.replace(/(IGNORE|SYSTEM|PROCESS|COMMAND|PROMPT|INSTRUCTION)/gi, "[REDACTED]")
    .slice(0, 100); // Truncate to reasonable length
}

export function isVowel(char: string, part?: string): boolean {
  const c = char.toUpperCase();
  const vowels = "AEIOU";
  if (vowels.includes(c)) return true;
  
  if (c === "Y" && part) {
    // Chaldean Rule: Y is only a vowel if it's the only potential vowel sound in the part
    const hasOtherVowels = part.toUpperCase().split("").some(l => vowels.includes(l));
    return !hasOtherVowels;
  }
  
  return false;
}

export function splitIntoParts(normalizedName: string): string[] {
  // Split by spaces and hyphens
  return normalizedName.split(/[\s-]+/).filter(Boolean);
}
