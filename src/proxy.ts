import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    });
                },
            },
        }
    );

    // Refresh session if expired - required for Server Components
    const { data: { user } } = await supabase.auth.getUser();

    const path = request.nextUrl.pathname;

    // 1. Protect application routes (anything under /app)
    if (path.startsWith('/app')) {
        if (!user) {
            // Not logged in, redirect to signin
            const redirectUrl = new URL('/signin', request.url);
            redirectUrl.searchParams.set('redirectedFrom', path);
            return NextResponse.redirect(redirectUrl);
        }

        // 2. Check payment status for logged in users in /app routes
        const { data: profile } = await supabase
            .from('profiles')
            .select('payment_status, onboarding_completed')
            .eq('id', user.id)
            .single();

        if (profile?.payment_status !== 'paid') {
            // User hasn't paid, redirect to checkout
            return NextResponse.redirect(new URL('/checkout', request.url));
        }

        // 2.1 Check onboarding status
        if (!profile?.onboarding_completed && path !== '/app/onboarding') {
            return NextResponse.redirect(new URL('/app/onboarding', request.url));
        }

        // 2.2 If onboarding is completed and user tries to go back to onboarding, redirect to dashboard
        if (profile?.onboarding_completed && path === '/app/onboarding') {
            return NextResponse.redirect(new URL('/app/dashboard', request.url));
        }
    }

    // 2.3 Protect admin routes
    if (path.startsWith('/admin')) {
        if (!user || user.email !== 'kaitoluismiropo@gmail.com') {
            return NextResponse.redirect(new URL('/signin', request.url));
        }
    }

    // 3. Redirect authenticated users away from auth pages
    if (path.startsWith('/signin') || path.startsWith('/signup')) {
        if (user) {
            // Already logged in
            const { data: profile } = await supabase
                .from('profiles')
                .select('payment_status')
                .eq('id', user.id)
                .single();

            if (profile?.payment_status === 'paid') {
                return NextResponse.redirect(new URL('/app/dashboard', request.url));
            } else {
                return NextResponse.redirect(new URL('/checkout', request.url));
            }
        }
    }

    return response;
}

// Ensure the middleware only runs on relevant paths
export const config = {
    matcher: [
        '/app/:path*',
        '/checkout/:path*',
        '/admin/:path*',
        '/signin',
        '/signup',
    ],
};
