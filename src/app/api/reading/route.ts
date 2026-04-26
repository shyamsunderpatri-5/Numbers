import { NextRequest, NextResponse } from "next/server";
import { generateHighConversionReading } from "@/lib/numerology/high-conversion-service";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { z } from "zod";

const readingSchema = z.object({
  fullName: z.string().min(1),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  problemType: z.enum(["money", "career", "relationships", "confusion"]),
});

export async function POST(request: NextRequest) {
  try {
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

    const body = await request.json();
    const parsed = readingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error }, { status: 400 });
    }

    // Generate High-Conversion Reading
    const reading = await generateHighConversionReading(
      parsed.data.fullName,
      new Date(parsed.data.dateOfBirth),
      parsed.data.problemType
    );

    // Store in Database with problem context
    const { error: dbError } = await supabase.from('readings').insert({
      user_id: session.user.id,
      reading_name: parsed.data.fullName,
      birth_date: parsed.data.dateOfBirth,
      data: {
        problem_type: parsed.data.problemType,
        ...reading
      },
      type: "personal",
      is_saved: true
    });

    if (dbError) {
      console.error("Database storage failed:", dbError);
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
