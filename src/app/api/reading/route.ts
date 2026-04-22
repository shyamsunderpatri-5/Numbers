/**
 * NUMERIQ.AI - Reading API Route
 * POST /api/reading
 */

import { NextRequest, NextResponse } from "next/server";
import { generateReading } from "@/lib/numerology/readingService";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { z } from "zod";

const readingSchema = z.object({
  fullName: z.string().min(1),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
});

export async function POST(request: NextRequest) {
  try {
    // 1. Auth Check (Server-side)
    const response = NextResponse.next();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            // Placeholder for cookie management in API route if needed
          },
          remove(name: string, options: CookieOptions) {
            // Placeholder
          },
        },
      }
    );

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Validate Input
    const body = await request.json();
    const parsed = readingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error }, { status: 400 });
    }

    // 3. Generate Reading (Layer 1, 2, 3)
    const reading = await generateReading(
      parsed.data.fullName,
      new Date(parsed.data.dateOfBirth)
    );

    // 4. Store in Database
    const { error: dbError } = await supabase.from('readings').insert({
      user_id: session.user.id,
      full_name: parsed.data.fullName,
      date_of_birth: parsed.data.dateOfBirth,
      destiny_number: reading.mathData.destinyNumber,
      life_path_number: reading.mathData.lifePathNumber,
      mathematical_data: reading.mathData,
      ai_reading_json: reading
    });

    if (dbError) {
      console.error("Database storage failed:", dbError);
      // We still return the reading even if storage fails, but log it
    }

    return NextResponse.json(reading);

  } catch (error: any) {
    console.error("Reading API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
