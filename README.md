# NUMERIQ.AI — Sovereign Reasoning Engine

NUMERIQ is a Global Chaldean Numerology Intelligence SaaS Platform. It merges ancient mathematical science with modern AI determinism, providing enterprise-grade numerology readings through a heavily guarded "Sovereign Reasoning Architecture."

## Architecture Overview

NUMERIQ is built on the **Five Locks** architectural principle, ensuring that AI is used *only* for narrative synthesis, while all mathematical operations and symbolic logic remain purely deterministic and framework-agnostic.

1. **Epistemological Integrity:** Math runs deterministically in pure TypeScript.
2. **Deterministic Routing:** Calculations control which traits are routed to the LLM.
3. **RAG-Bound Narrative:** LLMs can only synthesize based on verified Chaldean canonical traits.
4. **Golden Authority Validation:** A secondary LLM pass audits the output to prevent "AI Drift" or "Poison Pill" interpretations.
5. **Ephemerality:** Interpretations are generated instantly. Personal data is never stored long-term unless requested via an Enterprise plan.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4, Framer Motion
- **Authentication & Database:** Supabase SSR (PKCE Flow)
- **AI Synthesis:** Groq SDK (Llama 3 70B Versatile)
- **Payments:** Stripe Checkout
- **PDF Generation:** `@react-pdf/renderer`

## Project Structure

```text
src/
├── app/                  # Next.js App Router (UI & API Routes)
│   ├── (auth)/           # Secure SSR Login & Signup
│   ├── (dashboard)/      # Protected Dashboard & Sovereign Preview
│   └── api/              # Two-Stage API (Deterministic & Generative)
├── components/           # React Components (UI, Auth, PDF)
└── lib/                  
    ├── engine/           # 🔒 SEALED: Sovereign Reasoning Engine
    │   ├── core/         # Pure Math & Chaldean Computations
    │   ├── ontology/     # Types and Data Structures
    │   ├── synthesis/    # LLM Interaction & Context Mapping
    │   └── validators/   # Golden Pass & Weight Audits
    └── supabase/         # Supabase SSR & Browser Clients
```

## Setup & Local Development

### 1. Environment Variables
Create a `.env.local` file with the following keys:
```env
# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Groq (AI Synthesis)
GROQ_API_KEY=your_groq_key

# Stripe (Payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 2. Database Migrations
Run the SQL files located in `supabase/migrations/` in your Supabase SQL Editor. This will set up the `profiles`, `login_attempts`, and the critical `sovereignty_logs` tables required for system health monitoring.

### 3. Start the Server
```bash
npm install
npm run dev
```

## The Two-Stage Pipeline

NUMERIQ operates on a conversion-optimized API pipeline:

1. **Stage 1 (Deterministic / Free):** `POST /api/sovereign-reading`
   - Calculates the compound number and planetary alignment instantly.
   - Extremely fast, highly cacheable, no LLM cost.
   - Used for the UI "Preview Insight".

2. **Stage 2 (Generative / Paid):** `POST /api/sovereign-narrative`
   - Triggers the Pilgrim Persona via Groq.
   - Secured behind Stripe payment verification (`payment_intent_id`).
   - Ensures strict idempotency (will not charge or generate twice for the same session).
   - Generates the fully formatted PDF output.

## Security & Observability

- **Rate Limiting:** Both API routes are protected by Upstash Redis to prevent abuse and API cost spikes.
- **Observability:** Every run is logged to `sovereignty_logs` tracking `engine_version`, `llm_model`, latency, confidence scores, and pass/fail rates for the Golden Validator.
- **Hydration Guards:** React PDF links are dynamically imported to prevent Next.js Turbopack compilation crashes over Node polyfills.
- **SSR Cookies:** Fully compliant `@supabase/ssr` implementation utilizing `setAll` cookie synchronization.

## Phase 3: What's Next?
Following a successful staging deployment and analysis of user interpretation logs, the next phase will expand the Engine to encompass the **Compatibility System** (mapping interactions between two distinct Sovereign profiles).
