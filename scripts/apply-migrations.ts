import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
  const migrationsDir = path.join(process.cwd(), 'supabase/migrations')
  const files = [
    '20240425_match_optimization.sql'
  ]

  for (const file of files) {
    const filePath = path.join(migrationsDir, file)
    if (!fs.existsSync(filePath)) continue;

    const sql = fs.readFileSync(filePath, 'utf8')
    console.log(`\n🚀 Applying Migration: ${file}`)
    
    // We try to execute the SQL. 
    // If your Supabase doesn't have an 'exec_sql' RPC, we'll try an alternative.
    const { error } = await supabase.rpc('exec_sql', { sql })
    
    if (error) {
      console.error(`❌ RPC 'exec_sql' failed: ${error.message}`)
      console.log(`\n⚠️  MANUAL ACTION REQUIRED:`)
      console.log(`   The migration could not be applied automatically via API.`)
      console.log(`   Please copy the content of:`)
      console.log(`   ${filePath}`)
      console.log(`   and execute it in the Supabase SQL Editor (Dashboard > SQL Editor).`)
    } else {
      console.log(`✅ Migration Applied Successfully.`)
    }
  }
}

main().catch(console.error)
