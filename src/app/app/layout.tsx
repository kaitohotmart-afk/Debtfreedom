"use client";

import Sidebar from "@/components/app/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { user, profile, loading, isPaid } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Double check authentication and payment in client side
        if (!loading) {
            if (!user) {
                router.push("/signin");
            } else if (!isPaid) {
                router.push("/checkout");
            } else if (!profile?.onboarding_completed && pathname !== "/app/onboarding") {
                router.push("/app/onboarding");
            }
        }
    }, [user, profile, loading, isPaid, router, pathname]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user || !isPaid) {
        return null; // Will redirect via useEffect
    }

    // Onboarding page has its own layout (full screen)
    if (pathname === "/app/onboarding") {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-black text-white flex">
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

                <main className="flex-1 p-6 md:p-12 overflow-y-auto relative z-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
