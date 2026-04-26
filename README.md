# 🔯 NUMERIQ.AI — SOVEREIGN INTELLIGENCE ENGINE v1.1
### FULL ARCHITECTURAL SPECIFICATION (HLD/LLD)

This document serves as the master blueprint for the NUMERIQ.AI Astro-Numerology Fusion Platform. It is designed for maximum clarity for both human engineers and AI systems.

---

## 🏗️ 1. HIGH-LEVEL DESIGN (HLD)

### A. Core Architecture: The "Sovereign Equation"
Identity (Chaldean) + Timing (Vedic) = Action (Synthesis).
The system is built as a **Tri-Layer Architecture**:
1.  **Deterministic Layer (Math):** TypeScript-based utilities for calculations.
2.  **Intelligence Layer (RAG):** Context-aware vector retrieval from 132+ expert scenarios.
3.  **Synthesis Layer (Orchestration):** LLM-based fusion with strict systemic guardrails.

### B. The Hard Input Contract
To eliminate AI hallucination, the system calculates all core values *before* the AI is prompted. This data is injected as a **Deterministic Math Contract** (JSON-like structure) that the AI is strictly forbidden from recalculating.

---

## 🛠️ 2. LOW-LEVEL DESIGN (LLD) — COMPONENT REGISTRY

### 💠 Logic Component (`/src/lib/engine/logic`)
- **`calculator-utils.ts`**: 
    - **`calculateNameNumber`**: Implements Chaldean breakdown. Rules: Word-by-word summation. **Sacred 9 Rule:** No letter is assigned 9 (sacred vibration).
    - **`calculateBirthNumber`**: Reduces birth day to root digit (1-9).
    - **`calculateDestinyNumber`**: Sums full DOB (D+M+Y) to root digit.
    - **`validateDOB`**: Regex-based strict date validation (detects Feb 30, April 31 errors).

### 💠 Synthesis Component (`/src/lib/engine/synthesis`)
- **`master-response-orchestrator.ts`**:
    - **Planetary Friendship Matrix**: Encodes 9x9 Vedic friendship relations (Sun-Saturn enmity, Venus-Mercury friendship, etc.).
    - **`FusionContext`**: Synthesizes math data with the current Vara (day ruler) and Mahadasha to create a "Fusion Score."

### 💠 Intelligence Component (`/src/lib/engine/intelligence`)
- **`master-system-prompt.ts`**: The "Jyotish-Guru" persona. Hard-coded rules for Sanskrit terminology and tone.
- **`prompt-designer.ts`**:
    - **Query Sanitization**: Regex scrubbers for forbidden Pythagorean terms ("Life Path", "Expression Number").
    - **Category Routing**: Specific context injection for Career vs. Marriage vs. Finance.

### 💠 Service Component (`/src/lib/engine/service`)
- **`astro-numerology-service.ts`**: The central API gateway. Orchestrates math, RAG retrieval, and response formatting into the "Golden Structure."

---

## 📚 3. RAG INVENTORY (KNOWLEDGE BASE)
Our database (`library_embeddings` & `vedic_library_embeddings`) contains **43+ High-Density Rich Semantic Packets** (150-220 words each). 

### ✅ Hydrated Topics:
1.  **Chaldean Fundamentals:** 1-52 Compound Archetypes, Letter-to-Number mapping, Sacred 9 Philosophy.
2.  **Identity Traits:** Root 1 (Sun) through Root 9 (Mars) comprehensive personalities.
3.  **Timing (Vedic):** All 9 Mahadasha cycles (Sun 6y, Rahu 18y, Saturn 19y, etc.).
4.  **Relationship (Koota):** Ashta Koota Milan (36-point system), Nadi Dosha, Gana Koota, Bhakoot Koota.
5.  **Panchanga:** Tithi (Lunar Days), Amavasya (New Moon) Ancestor Worship, Brahma Muhurta.
6.  **Remedies:** Planetary Mantras, Gemstones (Ruby, Emerald, Blue Sapphire), Charity Protocols.
7.  **Yogas:** Kaal Sarp Yoga detection, Neecha Bhanga Raja Yoga (Rise from Weakness).

---

## 📊 4. SYSTEM INTEGRITY & AUDIT
- **RAG Audit Score:** **132/132 (100%)** — Every knowledge scenario passes expert verification.
- **Sovereignty Check:** PASS — AI is blocked from using Western/Pythagorean terms.
- **Data Integrity:** PASS — Suresh Kumar (39/3) and Sachin Tendulkar (50/5) math verified.

---

## ⚖️ 5. THE GOLDEN RESPONSE STRUCTURE
Every output follows this exact hierarchy:
1.  🔢 **Numerology Insight**: Archetypal meaning of the Compound and Root numbers.
2.  🔯 **Astrology Insight**: Analysis of the current **Vimshottari Mahadasha**.
3.  ⚖️ **Combined Interpretation**: Synergy/Conflict between Name Planet and Dasha Planet.
4.  📌 **Practical Guidance**: Actionable remedies (Mantra, Gem, Color).
5.  ⏳ **Timing**: Exact periods for successful action.

---

## 🚀 6. CURRENT DEVELOPED FEATURES
- [x] **Deterministic Math Engine**: Name, Birth, Destiny, Personal Year/Month/Day.
- [x] **Fusion Intelligence**: Planetary Friendship detection.
- [x] **Marriage Compatibility**: 36-point Koota + Chaldean harmony.
- [x] **Name Architect**: Auspicious spelling adjustment logic.
- [x] **Query Sanitization**: Auto-redaction of non-sovereign terms.

---
*Developed by Sovereign Intelligence Engineering for NUMERIQ.AI*
