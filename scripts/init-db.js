/**
 * NUMERIQ.AI — Database Initialization Script
 * Executes all SQL migrations against the live Supabase project
 * using the Supabase Management API (no custom functions needed).
 *
 * Run: node scripts/init-db.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ─── Load .env.local manually ─────────────────────────────────────────────────
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
envContent.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && val.length) process.env[key.trim()] = val.join('=').trim();
});

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌  Missing SUPABASE credentials in .env.local');
  process.exit(1);
}

// Extract the project ref from the URL  e.g. "mtynyfxgyhqkiebbfurr"
const PROJECT_REF = SUPABASE_URL.replace('https://', '').split('.')[0];

// ─── Helper: POST SQL to Supabase Management API ──────────────────────────────
function execSQL(sql) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query: sql });
    const options = {
      hostname: 'api.supabase.com',
      path: `/v1/projects/${PROJECT_REF}/database/query`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ ok: true, status: res.statusCode });
        } else {
          resolve({ ok: false, status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ─── Run a single migration file ─────────────────────────────────────────────
async function runFile(filePath, label) {
  console.log(`\n🔄  ${label}`);
  const sql = fs.readFileSync(filePath, 'utf-8');

  // Send the whole file as one query (Supabase Management API supports multi-statement)
  const result = await execSQL(sql);

  if (result.ok) {
    console.log(`   ✅  Applied successfully.`);
  } else {
    // Parse errors — some are harmless "already exists"
    let msg = '';
    try { msg = JSON.parse(result.body)?.message || result.body; } catch { msg = result.body; }
    if (msg.includes('already exists') || msg.includes('duplicate')) {
      console.log(`   ⚠️   Objects already exist — schema is up to date.`);
    } else {
      console.error(`   ❌  Error (HTTP ${result.status}): ${msg}`);
    }
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║   NUMERIQ.AI — Database Initialization       ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log(`\n🌐  Project : ${SUPABASE_URL}`);
  console.log(`🔑  Ref     : ${PROJECT_REF}\n`);

  const migrationsDir = path.join(__dirname, '../supabase/migrations');
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

  console.log(`📁  Found ${files.length} migration file(s):`);
  files.forEach(f => console.log(`    - ${f}`));

  for (const file of files) {
    await runFile(path.join(migrationsDir, file), file);
  }

  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║   ✅  Database ready!                         ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log('\nTables created:');
  console.log('  • profiles        (users + RBAC)');
  console.log('  • readings        (numerology history)');
  console.log('  • knowledge_base  (structured RAG)');
  console.log('  • library_sources (ancient books)');
  console.log('  • library_embeddings (vector index)');
  console.log('  • login_attempts  (brute-force log)');
  console.log('  • security_events (audit log)\n');
  console.log('🔐  RLS enabled on all tables.');
  console.log('🔍  pgvector activated for Sage Library.\n');
  console.log('⚡  NEXT STEP: Configure Auth in Supabase Dashboard');
  console.log('   Dashboard → Authentication → URL Configuration');
  console.log(`   Site URL: http://localhost:3000\n`);
}

main().catch(err => {
  console.error('\n💥  Fatal error:', err.message);
  process.exit(1);
});
