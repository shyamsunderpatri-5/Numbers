import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

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
        },
      }
    );

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { type, enabled } = await request.json();

    // Logic for setting up webhooks or updating user preferences
    const { error } = await supabase
      .from('profiles')
      .update({ 
        notification_preferences: { 
          [type]: enabled 
        } 
      })
      .eq('id', session.user.id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: `Notification ${type} updated to ${enabled}` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
