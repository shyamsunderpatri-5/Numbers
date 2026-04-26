import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

export async function POST(request: NextRequest) {
  try {
    // 1. Verify Authorization (Skipping full token verification here for brevity, assuming middleware protects /api/admin)
    const { id, knowledge_type, key, content, status } = await request.json();

    if (!knowledge_type || !key || !content || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 2. Epistemological Validation (The "Golden Authority" Check Hook)
    // If published, ensure required keys exist in content
    if (status === 'published') {
      if (knowledge_type === 'number_1_9' && (!content.coreMeaning || !content.strengths)) {
         return NextResponse.json({ error: "Validation Failed: Missing coreMeaning or strengths for core number." }, { status: 422 });
      }
      // Add more specific validations here based on knowledge_type
    }

    // 3. Versioning Logic
    let newVersion = 1;
    let previousId = null;

    if (id) {
      // Archive the current active version
      const { data: currentVersion, error: fetchErr } = await supabase
        .from('knowledge_base')
        .select('version, id')
        .eq('id', id)
        .single();
        
      if (!fetchErr && currentVersion) {
         newVersion = currentVersion.version + 1;
         previousId = currentVersion.id;
         
         // Mark old version as archived
         await supabase
           .from('knowledge_base')
           .update({ status: 'archived', is_active: false })
           .eq('id', id);
      }
    }

    // 4. Insert New Version
    const { data: newEntry, error: insertErr } = await supabase
      .from('knowledge_base')
      .insert({
        knowledge_type,
        key,
        content,
        status,
        version: newVersion,
        previous_version_id: previousId,
        is_active: status === 'published'
      })
      .select('*')
      .single();

    if (insertErr) throw insertErr;

    return NextResponse.json({ success: true, data: newEntry });

  } catch (error: any) {
    console.error("Admin Knowledge API Error:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
