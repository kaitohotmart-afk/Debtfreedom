"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Sparkles, PartyPopper } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

export default function ThankYouPage() {
    const { t } = useLanguage();
    const { user, profile, loading } = useAuth();
    const router = useRouter();
    const [verifying, setVerifying] = useState(true);
    const [isPaid, setIsPaid] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/signin?redirectedFrom=/thank-you");
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (!user) return;

        // 1. Initial Check
        const checkStatus = async () => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('payment_status')
                    .eq('id', user.id)
                    .single();

                if (data?.payment_status === 'paid') {
                    setIsPaid(true);
                    setVerifying(false);
                }
            } catch (err) {
                console.error("Initial check error:", err);
            }
        };

        checkStatus();

        // 2. Realtime Subscription (The "Magic" part)
        const channel = supabase
            .channel(`profile_payment_${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'profiles',
                    filter: `id=eq.${user.id}`
                },
                (payload: any) => {
                    console.log('Realtime update received:', payload);
                    if (payload.new.payment_status === 'paid') {
                        setIsPaid(true);
                        setVerifying(false);
                    }
                }
            )
            .subscribe();

        // 3. Timeout fallback after 60 seconds (Safety net)
        const timeout = setTimeout(() => {
            setVerifying(false);
        }, 60000);

        return () => {
            supabase.removeChannel(channel);
            clearTimeout(timeout);
        };
    }, [user]);

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 text-center">
            <div className="max-w-2xl w-full">
                {verifying && !isPaid ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="relative w-32 h-32 mx-auto">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-b-4 border-emerald-500 rounded-full"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles className="w-10 h-10 text-emerald-500 animate-pulse" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-3xl md:text-4xl font-bold">{t("thanks.verifying_title")}</h1>
                            <p className="text-zinc-400 text-lg max-w-md mx-auto">
                                {t("thanks.verifying_subtitle")}
                            </p>
                        </div>

                        {/* Loading progress bar simulation */}
                        <div className="max-w-xs mx-auto h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 45, ease: "linear" }}
                                className="h-full bg-emerald-500"
                            />
                        </div>
                    </motion.div>
                ) : isPaid ? (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="space-y-8"
                    >
                        <div className="flex justify-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", damping: 12 }}
                                className="relative"
                            >
                                <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full" />
                                <CheckCircle2 className="w-24 h-24 text-emerald-500 relative z-10" />
                            </motion.div>
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent">
                                {t("thanks.success_title")}
                            </h1>
                            <p className="text-xl text-zinc-300">
                                {t("thanks.success_subtitle")}
                            </p>
                            <div className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-bold uppercase tracking-wider">
                                <PartyPopper className="w-4 h-4" />
                                {t("thanks.welcome_badge")}
                            </div>
                        </div>

                        <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/5 rounded-3xl p-10 space-y-8 shadow-2xl">
                            <div className="space-y-2">
                                <h3 className="text-lg font-bold text-white uppercase tracking-tight">{t("thanks.next_steps_title") || "O Que Acontece Agora?"}</h3>
                                <p className="text-zinc-400">
                                    {t("thanks.next_steps")}
                                </p>
                            </div>

                            <Link
                                href="/app/dashboard"
                                className="group relative w-full py-5 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-emerald-50 transition-all active:scale-95 shadow-xl shadow-white/5"
                            >
                                <span>{t("thanks.cta")}</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-8 max-w-md mx-auto"
                    >
                        <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto">
                            <Sparkles className="w-10 h-10 text-amber-500" />
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-3xl font-bold text-white">{t("thanks.timeout_title")}</h1>
                            <p className="text-zinc-400">
                                {t("thanks.timeout_subtitle")}
                            </p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Link
                                href="/app/dashboard"
                                className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl transition-colors"
                            >
                                {t("thanks.check_manually")}
                            </Link>
                            <Link
                                href="/contact"
                                className="text-sm text-zinc-500 hover:text-white transition-colors"
                            >
                                {t("checkout.contact_us")}
                            </Link>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
