"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { ResultsGauge } from "@/components/ResultsGauge";
import { ArrowRight, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export default function ResultsPage() {
    const router = useRouter();
    const { t } = useLanguage();
    const [score, setScore] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate data fetching / processing
        const timer = setTimeout(() => {
            const savedScore = localStorage.getItem("quizScore");
            if (savedScore) {
                setScore(parseInt(savedScore));
            } else {
                // Fallback for dev/testing if no score exists
                setScore(35);
            }
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    if (loading || score === null) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-t-danger-red border-white/10 rounded-full animate-spin" />
            </div>
        )
    }

    // Determine Zone
    const zone = score <= 40 ? "critical" : score <= 70 ? "warning" : "safe";

    return (
        <div className="min-h-screen bg-black text-white overflow-x-hidden">
            {/* Background Ambience */}
            <div className={cn("absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b opacity-20 pointer-events-none",
                zone === "critical" ? "from-danger-red" : zone === "warning" ? "from-warning-orange" : "from-success-green"
            )} />

            <div className="max-w-4xl mx-auto px-6 py-12 relative z-10 flex flex-col items-center">

                {/* Header */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center mb-10"
                >
                    <h2 className="text-gray-400 uppercase tracking-widest text-sm mb-2">{t("results.ready")}</h2>
                    <h1 className="text-3xl md:text-5xl font-display font-bold">{t("results.score_title")}</h1>
                </motion.div>

                {/* Gauge Section */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-12"
                >
                    <ResultsGauge score={score} />
                </motion.div>

                {/* Dynamic Analysis Card */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 mb-8 relative overflow-hidden group"
                >
                    <div className={cn("absolute top-0 left-0 w-1 h-full",
                        zone === "critical" ? "bg-danger-red" : zone === "warning" ? "bg-warning-orange" : "bg-success-green"
                    )} />

                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                        {zone === "critical" && <AlertTriangle className="text-danger-red w-8 h-8" />}
                        {zone === "warning" && <AlertTriangle className="text-warning-orange w-8 h-8" />}
                        {zone === "safe" && <CheckCircle className="text-success-green w-8 h-8" />}
                        {t(`results.zones.${zone}`)}
                    </h3>

                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                        {t(`results.analysis.${zone}`)}
                    </p>
                </motion.div>

                {/* Projection Graph (Simplified Visual) */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="w-full bg-black/40 border border-white/10 rounded-3xl p-8 mb-12"
                >
                    <h3 className="text-xl font-bold mb-1 text-gray-200">{t("results.projection.title")}</h3>
                    <p className="text-sm text-gray-500 mb-8">{t("results.projection.subtitle")}</p>

                    <div className="space-y-6">
                        {/* Current Path */}
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-400">{t("results.projection.current_path")}</span>
                            </div>
                            <div className="h-4 bg-gray-800 rounded-full overflow-hidden relative">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "20%" }}
                                    transition={{ delay: 1.5, duration: 1 }}
                                    className="absolute top-0 left-0 h-full bg-red-900/50"
                                />
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "20%" }} // Matches text usually
                                    transition={{ delay: 1.5, duration: 1 }}
                                    className="h-full bg-gradient-to-r from-gray-700 to-gray-600"
                                />
                            </div>
                        </div>

                        {/* RESET Path */}
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-white font-bold">{t("results.projection.reset_path")}</span>
                                <span className="text-success-green font-bold flex items-center gap-1">+480% <TrendingUp size={14} /></span>
                            </div>
                            <div className="h-4 bg-gray-800 rounded-full overflow-hidden shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "90%" }}
                                    transition={{ delay: 1.8, duration: 1.5, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-success-green to-emerald-400"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2.2 }}
                    className="w-full text-center"
                >
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">{t("results.cta.main")}</h3>
                    <p className="text-gray-400 mb-8">{t("results.cta.sub")}</p>

                    <button
                        onClick={() => router.push("/sales")}
                        className="w-full md:w-auto px-12 py-5 bg-gradient-to-r from-danger-red to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold text-xl rounded-full shadow-[0_0_40px_rgba(220,38,38,0.5)] hover:shadow-[0_0_60px_rgba(220,38,38,0.7)] transform hover:scale-105 transition-all duration-300 animate-pulse flex items-center justify-center gap-3 mx-auto"
                    >
                        {t("results.cta.button")} <ArrowRight className="w-6 h-6" />
                    </button>

                    <p className="mt-6 text-xs text-gray-600">
                        Limited spots available for the 90-day program.
                    </p>
                </motion.div>

            </div>
        </div>
    );
}
