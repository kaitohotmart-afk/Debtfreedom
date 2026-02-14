"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronRight,
    Target,
    Shield,
    Zap,
    TrendingUp,
    Users,
    Activity,
    Lock,
    ArrowRight,
    CheckCircle2
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function OnboardingPage() {
    const { t } = useLanguage();
    const { user, profile } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const totalSteps = 5;

    const handleNext = async () => {
        if (step < totalSteps) {
            setStep(step + 1);
        } else {
            setLoading(true);
            try {
                const supabase = getSupabaseBrowserClient();
                const { error } = await supabase
                    .from('profiles')
                    .update({ onboarding_completed: true })
                    .eq('id', user?.id);

                if (error) throw error;

                // Redirect to first module (Financial X-Ray) or Dashboard
                router.push("/app/dashboard");
            } catch (err) {
                console.error("Error completing onboarding:", err);
                setLoading(false);
            }
        }
    };

    const handleSkip = async () => {
        setLoading(true);
        try {
            const supabase = getSupabaseBrowserClient();
            await supabase
                .from('profiles')
                .update({ onboarding_completed: true })
                .eq('id', user?.id);

            router.push("/app/dashboard");
        } catch (err) {
            console.error("Error skipping onboarding:", err);
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6 text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-500 text-xs font-bold tracking-widest uppercase mb-4">
                            <Zap className="w-3 h-3" />
                            {t("dashboard.onboarding.steps.1.badge")}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-white via-zinc-400 to-zinc-600 bg-clip-text text-transparent leading-tight">
                            {t("dashboard.onboarding.steps.1.title")}
                        </h1>
                        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                            {t("dashboard.onboarding.steps.1.subtitle")}
                        </p>
                        <div className="pt-8">
                            <div className="w-24 h-24 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
                                <Target className="w-12 h-12 text-emerald-500" />
                            </div>
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("dashboard.onboarding.steps.2.title")}</h2>
                            <p className="text-zinc-400 max-w-xl mx-auto">{t("dashboard.onboarding.steps.2.subtitle")}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            {[
                                { key: 'r', icon: Activity, color: 'text-blue-500' },
                                { key: 'e', icon: Zap, color: 'text-red-500' },
                                { key: 's', icon: TrendingUp, color: 'text-emerald-500' },
                                { key: 'e2', icon: Shield, color: 'text-purple-500' },
                                { key: 't', icon: Users, color: 'text-amber-500' },
                            ].map((pillar, i) => (
                                <div key={pillar.key} className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl group hover:border-zinc-700 transition-colors">
                                    <div className={`w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <pillar.icon className={`w-5 h-5 ${pillar.color}`} />
                                    </div>
                                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-1">
                                        {pillar.key.toUpperCase()}
                                    </p>
                                    <p className="text-sm font-medium leading-tight">
                                        {t(`dashboard.onboarding.steps.2.pillar_${pillar.key}`)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-8"
                    >
                        <div className="text-center">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("dashboard.onboarding.steps.3.title")}</h2>
                            <p className="text-zinc-400 max-w-xl mx-auto mb-10">{t("dashboard.onboarding.steps.3.subtitle")}</p>
                        </div>
                        <div className="relative space-y-6">
                            <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-zinc-800 hidden md:block" />
                            {[
                                { weeks: '1-4', key: 'week_1_4' },
                                { weeks: '5-8', key: 'week_5_8' },
                                { weeks: '9-12', key: 'week_9_12' },
                                { weeks: '13', key: 'week_13' },
                            ].map((m, i) => (
                                <div key={i} className="flex gap-6 items-start relative group">
                                    <div className="w-14 h-14 rounded-full bg-zinc-900 border-4 border-zinc-950 flex items-center justify-center z-10 shrink-0 group-hover:border-emerald-500/30 transition-colors">
                                        <span className="text-xs font-black text-emerald-500">W{m.weeks}</span>
                                    </div>
                                    <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl flex-grow group-hover:bg-zinc-900 transition-colors">
                                        <h3 className="font-bold text-lg">{t(`dashboard.onboarding.steps.3.${m.key}`)}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-10 text-center"
                    >
                        <div className="max-w-xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("dashboard.onboarding.steps.4.title")}</h2>
                            <p className="text-zinc-400 leading-relaxed">{t("dashboard.onboarding.steps.4.subtitle")}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto">
                            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
                                <Users className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                                <div className="text-2xl font-black">{t("dashboard.onboarding.steps.4.stat_users").split(' ')[0]}</div>
                                <div className="text-xs text-zinc-500 font-bold uppercase tracking-tighter">{t("dashboard.onboarding.steps.4.stat_users").split(' ').slice(1).join(' ')}</div>
                            </div>
                            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
                                <CheckCircle2 className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                                <div className="text-2xl font-black">{t("dashboard.onboarding.steps.4.stat_debt").split(' ')[0]}</div>
                                <div className="text-xs text-zinc-500 font-bold uppercase tracking-tighter">{t("dashboard.onboarding.steps.4.stat_debt").split(' ').slice(1).join(' ')}</div>
                            </div>
                        </div>
                        <div className="flex -space-x-3 justify-center">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="w-12 h-12 rounded-full border-4 border-black bg-zinc-800 overflow-hidden">
                                    <img
                                        src={`https://i.pravatar.cc/150?u=${i + 10}`}
                                        alt="User"
                                        className="w-full h-full object-cover opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-pointer"
                                    />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );
            case 5:
                return (
                    <motion.div
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-8 text-center"
                    >
                        <div className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20 mb-6">
                            <Activity className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black">{t("dashboard.onboarding.steps.5.title")}</h2>
                        <p className="text-zinc-400 text-lg max-w-xl mx-auto leading-relaxed">
                            {t("dashboard.onboarding.steps.5.subtitle")}
                        </p>
                        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl max-w-md mx-auto flex items-start gap-4 text-left">
                            <Lock className="w-5 h-5 text-emerald-500 mt-1 shrink-0" />
                            <p className="text-sm text-zinc-400">
                                This mission takes approximately 15 minutes. Ensure you are in a quiet place and have access to your bank statements or a general idea of your monthly spending.
                            </p>
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500 selection:text-white overflow-hidden">
            {/* Background elements */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
            </div>

            <main className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 max-w-6xl mx-auto">
                <div className="w-full mb-12 flex justify-between items-center">
                    <div className="flex gap-2">
                        {Array.from({ length: totalSteps }).map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-500 ${i + 1 <= step
                                        ? 'w-8 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                                        : 'w-4 bg-zinc-800'
                                    }`}
                            />
                        ))}
                    </div>
                    {step < totalSteps && (
                        <button
                            onClick={handleSkip}
                            className="text-zinc-500 hover:text-white text-sm font-medium transition-colors"
                        >
                            {t("dashboard.onboarding.skip")}
                        </button>
                    )}
                </div>

                <div className="flex-grow w-full flex items-center justify-center py-12">
                    <AnimatePresence mode="wait">
                        {renderStep()}
                    </AnimatePresence>
                </div>

                <div className="w-full mt-12">
                    <button
                        onClick={handleNext}
                        disabled={loading}
                        className="w-full md:w-auto md:min-w-[240px] mx-auto py-5 px-8 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-emerald-500 hover:text-white transition-all transform hover:-translate-y-1 active:translate-y-0 group"
                    >
                        {loading ? (
                            <span className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                {step === totalSteps
                                    ? t("dashboard.onboarding.finish")
                                    : t("dashboard.onboarding.next")
                                }
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                    {step === 5 && (
                        <p className="text-center text-zinc-600 text-[10px] mt-4 uppercase tracking-[0.2em] font-bold">
                            Elite Access Secured • 256-bit Encryption
                        </p>
                    )}
                </div>
            </main>
        </div>
    );
}
