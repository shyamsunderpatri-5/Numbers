import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  // 1. Handle missing code
  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  // 2. Initialize SSR Client with proper cookie handling
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  );

  // 3. Exchange Code for Session
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  // 4. Handle Exchange Failure
  if (error) {
    console.error('Auth Callback Error:', error.message);
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  // 5. Sanitize Redirect (Security: Open Redirect Protection)
  const isLocalUrl = next.startsWith('/');
  const safeRedirect = isLocalUrl ? next : '/dashboard';

  return NextResponse.redirect(`${origin}${safeRedirect}`);
}
