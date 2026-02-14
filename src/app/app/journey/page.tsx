"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
    CheckCircle2,
    Circle,
    Lock,
    Unlock,
    Award,
    Star,
    Trophy,
    Calendar,
    Target,
    Zap,
    Shield,
    Flame,
    ChevronRight,
    MapPin
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WeekData {
    id: number;
    title: string;
    theme: string;
    description: string;
    checklist: string[];
}

interface UserProgress {
    current_day: number;
    current_week: number;
    completed_weeks: number[];
    badges_earned: string[];
    milestones_reached: Record<string, any>;
}

export default function JourneyPage() {
    const { t } = useLanguage();
    const { user } = useAuth();
    const [progress, setProgress] = useState<UserProgress | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedWeek, setSelectedWeek] = useState<number>(1);

    useEffect(() => {
        if (user) {
            fetchProgress();
        }
    }, [user]);

    const fetchProgress = async () => {
        if (!user) return;
        setLoading(true);
        const supabase = getSupabaseBrowserClient();

        const { data, error } = await supabase
            .from("user_progress")
            .select("*")
            .eq("user_id", user.id)
            .single();

        if (error) {
            console.error("Error fetching progress:", error);
        } else {
            setProgress(data);
            setSelectedWeek(data.current_week || 1);
        }
        setLoading(false);
    };

    const weeks = Array.from({ length: 13 }, (_, i) => i + 1).map(num => {
        const checklistRaw = (t as any)(`dashboard.journey.weeks.${num}.checklist`, { returnObjects: true });
        const checklist = Array.isArray(checklistRaw) ? checklistRaw : [];

        return {
            id: num,
            title: t(`dashboard.journey.weeks.${num}.title`),
            theme: t(`dashboard.journey.weeks.${num}.theme`),
            description: t(`dashboard.journey.weeks.${num}.description`),
            checklist: checklist as string[]
        };
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                    <p className="text-zinc-500 animate-pulse">{t("common.loading")}</p>
                </div>
            </div>
        );
    }

    const currentWeekData = weeks.find(w => w.id === selectedWeek);
    const isWeekLocked = (weekId: number) => {
        if (!progress) return true;
        return weekId > (progress.current_week || 1);
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12">
            {/* Header */}
            <header className="max-w-6xl mx-auto mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-6"
                >
                    <div>
                        <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
                            <Target className="w-5 h-5" />
                            <span className="tracking-[0.2em] text-sm uppercase">{t("dashboard.journey.title")}</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
                            THE 90-DAY <span className="text-emerald-500">RESET™</span>
                        </h1>
                        <p className="text-zinc-400 mt-4 text-lg max-w-2xl">
                            {t("dashboard.journey.subtitle")}
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-zinc-900 border border-white/5 p-4 rounded-2xl flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500 uppercase font-bold">{t("dashboard.journey.stats.current_week")}</p>
                                <p className="text-xl font-black">{progress?.current_week || 1} / 13</p>
                            </div>
                        </div>
                        <div className="bg-zinc-900 border border-white/5 p-4 rounded-2xl flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-400">
                                <Award className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500 uppercase font-bold">{t("dashboard.journey.stats.badges")}</p>
                                <p className="text-xl font-black">{progress?.badges_earned?.length || 0}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </header>

            <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Timeline Sidebar */}
                <div className="lg:col-span-4 space-y-4 max-h-[70vh] overflow-y-auto pr-4 scrollbar-hide">
                    {weeks.map((week) => {
                        const isLocked = isWeekLocked(week.id);
                        const isCurrent = progress?.current_week === week.id;
                        const isSelected = selectedWeek === week.id;
                        const isCompleted = progress?.completed_weeks?.includes(week.id);

                        return (
                            <motion.button
                                key={week.id}
                                whileHover={!isLocked ? { x: 4 } : {}}
                                whileTap={!isLocked ? { scale: 0.98 } : {}}
                                onClick={() => !isLocked && setSelectedWeek(week.id)}
                                className={`
                                    w-full p-4 rounded-2xl border transition-all flex items-center gap-4 text-left
                                    ${isSelected
                                        ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                                        : isLocked
                                            ? "bg-zinc-900/50 border-white/5 opacity-50 cursor-not-allowed"
                                            : "bg-zinc-900 border-white/5 hover:border-white/10"
                                    }
                                `}
                            >
                                <div className={`
                                    w-10 h-10 rounded-full flex items-center justify-center font-black shrink-0
                                    ${isCompleted
                                        ? "bg-emerald-500 text-black"
                                        : isCurrent
                                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                                            : isLocked
                                                ? "bg-zinc-800 text-zinc-600"
                                                : "bg-zinc-800 text-white"
                                    }
                                `}>
                                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : week.id}
                                </div>
                                <div className="flex-grow">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-bold uppercase tracking-wider opacity-60">Week {week.id}</p>
                                        {isLocked && <Lock className="w-3 h-3 opacity-40" />}
                                    </div>
                                    <p className={`font-bold truncate ${isLocked ? "text-zinc-500" : "text-white"}`}>{week.title}</p>
                                </div>
                                {isSelected && <motion.div layoutId="active" className="w-1 h-6 bg-emerald-500 rounded-full" />}
                            </motion.button>
                        );
                    })}
                </div>

                {/* Week Content */}
                <div className="lg:col-span-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedWeek}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-zinc-900 border border-white/5 rounded-3xl p-8 md:p-12 relative overflow-hidden"
                        >
                            {/* Decoration */}
                            <div className="absolute top-0 right-0 p-12 opacity-5">
                                <MapPin className="w-64 h-64 text-emerald-500" />
                            </div>

                            <div className="relative z-10">
                                <div className="inline-block px-4 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
                                    {currentWeekData?.theme}
                                </div>

                                <h2 className="text-5xl font-black tracking-tighter mb-6">
                                    {currentWeekData?.title}
                                </h2>

                                <p className="text-zinc-400 text-xl leading-relaxed mb-12">
                                    {currentWeekData?.description}
                                </p>

                                <div className="space-y-6">
                                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-emerald-400" />
                                        Missions Checklist
                                    </h3>

                                    <div className="space-y-3">
                                        {(currentWeekData?.checklist || []).map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="group flex items-center gap-4 p-4 bg-black/40 border border-white/5 rounded-2xl hover:border-emerald-500/30 transition-colors cursor-pointer"
                                            >
                                                <div className="w-6 h-6 border-2 border-zinc-700 rounded-lg flex items-center justify-center group-hover:border-emerald-500 transition-colors">
                                                    {/* In a real app, this would be interactive */}
                                                    <Circle className="w-4 h-4 text-zinc-800 group-hover:text-emerald-500/50" />
                                                </div>
                                                <span className="text-zinc-300 font-medium">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Reward Section */}
                                <div className="mt-12 pt-12 border-t border-white/5">
                                    <div className="flex items-center gap-6 bg-black/40 p-6 rounded-2xl border border-white/5">
                                        <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400">
                                            <Trophy className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold">Week {selectedWeek} Badge</h4>
                                            <p className="text-zinc-500 text-sm">Complete all missions to unlock the "{currentWeekData?.title}" badge.</p>
                                        </div>
                                        <button className="ml-auto px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm font-bold transition-colors">
                                            View Badges
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Bottom Navigation Nudge */}
            <footer className="max-w-6xl mx-auto mt-24 text-center">
                <div className="inline-flex items-center gap-2 text-zinc-500 text-sm hover:text-white transition-colors cursor-pointer group">
                    <span>Scroll for more weeks</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
            </footer>
        </div>
    );
}
