# 🔯 NUMERIQ.AI — SOVEREIGN INTELLIGENCE ENGINE v1.1
### FULL ARCHITECTURAL SPECIFICATION (HLD/LLD) & RAG BASELINE

This document is the "Source of Truth" for the NUMERIQ.AI platform. It defines the mathematical, semantic, and structural boundaries of our Chaldean-Vedic fusion engine.

---

## 🏗️ 1. HIGH-LEVEL DESIGN (HLD)

### A. The "Sovereign Equation"
**Identity (Chaldean Numerology) + Timing (Vedic Astrology) = Action (Sovereign Synthesis).**
NUMERIQ.AI does not "generate" numerology; it **calculates** it via a deterministic math engine and **interprets** it via an expert-purified RAG system.

### B. Tri-Layer Architecture
1.  **Deterministic Layer (Math):** TypeScript utilities that perform Chaldean name-value mapping and Vedic Dasha calculations. This layer is the "Truth Provider."
2.  **Intelligence Layer (RAG):** A dual-silo vector database (`Xenova/all-MiniLM-L6-v2`) containing 132+ expert scenarios. It uses **Query Expansion** to bridge user language to expert terminology.
3.  **Synthesis Layer (Orchestration):** Fuses math data and RAG context into a cohesive narrative using a "Jyotish-Guru" persona.

### C. The Hard Input Contract
To eliminate AI hallucinations, all core values are calculated *before* the AI is engaged. The AI is strictly forbidden from recalculating math; it must accept the **Math Contract** as absolute truth.

---

## 🛠️ 2. LOW-LEVEL DESIGN (LLD) — COMPONENT REGISTRY

### 💠 Logic Component (`/src/lib/engine/logic`)
- **`calculator-utils.ts`**: 
    - **Name Calculation**: Word-by-word summation using the **Sacred 9 Rule** (number 9 is never assigned to a letter).
    - **Date Validation**: Strict regex and logic to prevent illegal dates (e.g., Feb 30).
    - **Vedic Engine**: 120-year Vimshottari Mahadasha and Antardasha calculation.

### 💠 Retrieval Component (`/src/lib/engine/retrieval`)
- **`sovereign-retrieval.ts`**: 
    - **Sovereign Bridge**: Implements query expansion (e.g., "Personality" -> "1st House Lagna").
    - **Multi-Probe Search**: Searches both Chaldean and Vedic silos and re-ranks results by semantic relevance.

### 💠 Synthesis Component (`/src/lib/engine/synthesis`)
- **`master-system-prompt.ts`**: Defines the "Jyotish-Guru" persona, enforcing Sanskrit terminology and redacting non-sovereign (Pythagorean) terms.
- **`planetary-matrix.ts`**: Encodes the 9x9 Vedic friendship/enmity rules.

### 💠 Service Gateway (`/src/lib/engine/service`)
- **`astro-numerology-service.ts`**: The master orchestrator.
    - 1. Calculates Math -> 2. Retrieves RAG -> 3. Builds Prompt -> 4. Returns Fused Response.

---

## 📊 3. RAG CORE & SOVEREIGNTY STATUS

Our knowledge base is purified of "Western Contamination" and locked at a production-ready baseline.

- **Coverage Score**: **98%** (Locked in `rag-baseline.json`)
- **Quality Score**: **99%**
- **Sovereignty Check**: **PASS** — Zero presence of "Life Path" or "Pythagorean" logic.
- **Maintenance**: **CI Guard Active**. The build will **FAIL** if retrieval quality regresses below 95%.

### ✅ Fully Hydrated Domains:
- **Chaldean**: Letter-to-Number Table, 1-52 Compound Archetypes, Root 1-9 Personalities.
- **Vedic**: Navagrahas, All Mahadashas/Antardashas, 12 Houses (Bhavas), Panchanga, Koota Matching.
- **Remedies**: Planetary Mantras, Gemstone Protocols, Charity timing.

---

## 🔒 4. SAFETY & LOCKING STRATEGY
We use a **4-Layer Lock** to prevent regression:
1.  **`rag-baseline.json`**: The immutable snapshot of current expert performance.
2.  **`scripts/rag-guard.ts`**: A build-gate that runs 10 critical spot-checks before every deployment.
3.  **Git Tags**: Versioned releases (e.g., `rag-v1.0`) ensuring traceability.
4.  **`npm run safety-audit`**: Full 132-scenario audit suite for manual validation.

---

## 🚀 5. CURRENT PROGRESS (v1.1)
- [x] **Math Engine**: Fully deterministic (Chaldean/Vedic).
- [x] **RAG Knowledge**: 98% coverage achieved and locked.
- [x] **Query Expansion**: Vocabulary bridge implemented.
- [x] **CI/CD Guard**: Build protection enabled.
- [ ] **UI Integration**: Next step — connect Chat UI to the Service Gateway.

---
*Developed for NUMERIQ.AI by Sovereign Intelligence Engineering*
