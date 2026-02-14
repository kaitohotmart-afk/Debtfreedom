"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import {
    Wallet,
    Zap,
    Target,
    TrendingUp,
    ArrowRight,
    Flame,
    Calendar,
    PlusCircle,
    AlertCircle,
    LayoutGrid,
    CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import AIAdvisorCard from "@/components/app/AIAdvisorCard";
import quotes from "@/config/motivation.json";
import { createNotification } from "@/lib/notifications";
import PushNotificationPrompt from "@/components/notifications/PushNotificationPrompt";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function DashboardPage() {
    const { t, language } = useLanguage();
    const { profile, user } = useAuth();
    const [hasSnapshot, setHasSnapshot] = useState(false);
    const [totalDebt, setTotalDebt] = useState(0);
    const [surplus, setSurplus] = useState(0);
    const [monthlyIncome, setMonthlyIncome] = useState(0);
    const [monthlyExpenses, setMonthlyExpenses] = useState(0);
    const [progress, setProgress] = useState({ day: 1, week: 1, streak: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) return;
            const supabase = getSupabaseBrowserClient();

            // 1. Fetch Snapshot & Surplus
            const { data: snapshot } = await supabase
                .from('financial_snapshots')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (snapshot) {
                setHasSnapshot(true);
                const totalIn = Number(snapshot.monthly_income) + Number(snapshot.additional_income);
                const totalOut = Number(snapshot.total_fixed_expenses);
                setMonthlyIncome(totalIn);
                setMonthlyExpenses(totalOut);
                setSurplus(totalIn - totalOut);
            }

            // 2. Fetch Total Debt
            const { data: debts } = await supabase
                .from('debts')
                .select('current_balance')
                .eq('user_id', user.id);

            if (debts) {
                const total = debts.reduce((sum: number, d: any) => sum + Number(d.current_balance), 0);
                setTotalDebt(total);
            }

            // 3. Fetch/Init Progress
            let { data: prog } = await supabase
                .from('user_progress')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (!prog) {
                const { data: newProg } = await supabase
                    .from('user_progress')
                    .insert({ user_id: user.id })
                    .select()
                    .single();
                prog = newProg;
            }

            if (prog) {
                setProgress({
                    day: prog.current_day,
                    week: prog.current_week,
                    streak: prog.streak_days
                });
            }

            // 4. Daily Motivation Logic
            const lastMotivationDate = localStorage.getItem('last_motivation_date');
            const today = new Date().toISOString().split('T')[0];

            if (lastMotivationDate !== today) {
                const { data: existingMotiv } = await supabase
                    .from('notifications')
                    .select('id')
                    .eq('user_id', user.id)
                    .eq('type', 'motivation')
                    .gte('created_at', today)
                    .limit(1);

                if (!existingMotiv || existingMotiv.length === 0) {
                    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
                    const title = language === 'pt' ? '💡 Inspiração do Dia' : '💡 Daily Inspiration';
                    const message = (randomQuote as any)[language] || randomQuote.en;

                    await createNotification(user.id, 'motivation', title, message);
                }
                localStorage.setItem('last_motivation_date', today);
            }

            setLoading(false);
        };

        fetchDashboardData();
    }, [user, language]);

    // Simple Score Calculation: (Surplus / TotalDebt) * coefficient + multiplier
    // Higher surplus relative to debt = higher score.
    const calculateScore = () => {
        if (!hasSnapshot || totalDebt === 0) return null;
        if (totalDebt === 0 && surplus > 0) return 100;

        const ratio = surplus / (totalDebt * 0.1); // Monthly surplus vs 10% of debt
        const baseScore = Math.min(100, Math.max(0, Math.round(ratio * 50)));
        return baseScore;
    };

    const score = calculateScore();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-10 h-10 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-8">
            <header className="flex justify-between items-end mb-12">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                        <span className="text-xs font-black text-orange-400 uppercase tracking-widest">
                            {progress.streak} {t("dashboard.streak.days")} {t("dashboard.streak.title")}
                        </span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter mb-1">
                        {t("dashboard.welcome_msg").split(',')[0]}, {profile?.full_name?.split(' ')[0] || 'Warrior'}!
                    </h1>
                    <p className="text-zinc-500">{t("dashboard.welcome_msg")}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-white">{profile?.full_name}</p>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">{profile?.subscription_tier}</p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-black font-black text-2xl shadow-xl shadow-emerald-500/20">
                        {profile?.full_name?.charAt(0) || 'U'}
                    </div>
                </div>
            </header>

            {/* Top Grid Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Card glow className="relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp className="w-12 h-12" />
                    </div>
                    <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-1">{t("dashboard.score.title")}</p>
                    <h2 className={`text-5xl font-black ${score ? 'text-emerald-400' : 'text-zinc-700'}`}>
                        {score ?? '---'}
                    </h2>
                    <p className="text-[10px] text-zinc-600 mt-4 font-bold uppercase tracking-wider">
                        {score ? t("dashboard.score.calculated") : t("dashboard.score.desc")}
                    </p>
                </Card>

                <Card className="relative overflow-hidden">
                    <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-1">{t("dashboard.progress.title")}</p>
                    <h2 className="text-5xl font-black text-white">
                        {t("dashboard.progress.day")} {progress.day} <span className="text-zinc-600 text-2xl">/ 90</span>
                    </h2>
                    <div className="w-full bg-zinc-800 h-2.5 rounded-full mt-5 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(progress.day / 90) * 100}%` }}
                            className="bg-emerald-500 h-full shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                        />
                    </div>
                </Card>

                <Card glow variant={totalDebt > 0 ? 'danger' : 'premium'} className="relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <AlertCircle className="w-12 h-12" />
                    </div>
                    <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-1">{t("dashboard.debt_card.title")}</p>
                    <h2 className={`text-5xl font-black ${totalDebt > 0 ? 'text-red-500' : 'text-zinc-700'}`}>
                        R {totalDebt.toLocaleString()}
                    </h2>
                    <p className="text-[10px] text-zinc-600 mt-4 font-bold uppercase tracking-wider">
                        {totalDebt > 0 ? t("dashboard.debt_card.subtitle") : t("dashboard.debt_card.empty")}
                    </p>
                </Card>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Main Action Section */}
                <div className="lg:col-span-8">
                    {!hasSnapshot ? (
                        <Card className="flex flex-col md:flex-row items-center gap-12 p-12 relative overflow-hidden group mb-8">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[100px] -mr-48 -mt-48" />
                            <div className="flex-1 space-y-6 text-center md:text-left relative z-10">
                                <Badge variant="success">
                                    <Zap className="w-3 h-3 fill-emerald-400 mr-1" /> {t("dashboard.mission.action_required")}
                                </Badge>
                                <h2 className="text-5xl font-black tracking-tighter leading-none">Execute Your <br /><span className="text-emerald-500">Financial X-Ray</span></h2>
                                <p className="text-zinc-400 text-xl leading-relaxed max-w-xl">
                                    We cannot fix what we cannot see. Map your cashflow today and let the Sniper Strategy begin.
                                </p>
                                <Link href="/app/x-ray">
                                    <Button size="lg" icon={ArrowRight} iconPosition="right" className="px-10 py-5 text-lg">
                                        Start X-Ray Now
                                    </Button>
                                </Link>
                            </div>
                            <div className="w-full max-w-xs aspect-square bg-zinc-950 rounded-[3rem] border border-zinc-800 flex items-center justify-center relative z-10 group-hover:border-emerald-500/20 transition-colors">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.05, 1],
                                        rotate: [0, 5, -5, 0]
                                    }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <Wallet className="w-32 h-32 text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors" />
                                </motion.div>
                            </div>
                        </Card>
                    ) : (
                        <Card className="flex flex-col md:flex-row items-center gap-12 p-12 relative overflow-hidden group mb-8">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[100px] -mr-48 -mt-48" />
                            <div className="flex-1 space-y-6 text-center md:text-left relative z-10">
                                <Badge variant="success">
                                    <Target className="w-3 h-3 fill-emerald-400 mr-1" /> {t("dashboard.mission.mission_02")}
                                </Badge>
                                <h2 className="text-5xl font-black tracking-tighter leading-none">Execute the <br /><span className="text-emerald-500">Debt Sniper</span></h2>
                                <p className="text-zinc-400 text-xl leading-relaxed max-w-xl">
                                    Your data has been analyzed. We've found the mathematical path to your freedom. Execute the strategy now.
                                </p>
                                <Link href="/app/debt">
                                    <Button size="lg" icon={TrendingUp} iconPosition="right" className="px-10 py-5 text-lg">
                                        Deploy Strategy
                                    </Button>
                                </Link>
                            </div>
                            <div className="w-full max-w-xs aspect-square bg-zinc-950 rounded-[3rem] border border-zinc-800 flex items-center justify-center relative z-10 group-hover:border-emerald-500/20 transition-colors">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.05, 1],
                                        rotate: [0, -5, 5, 0]
                                    }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <Target className="w-32 h-32 text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors" />
                                </motion.div>
                            </div>
                        </Card>
                    )}

                    {/* Weekly Mission List */}
                    <Card variant="premium" className="bg-zinc-900/30">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            {t("dashboard.mission.week")} {progress.week}: Weekly Objectives
                        </h3>
                        <div className="space-y-4">
                            {[
                                { id: 1, title: t("dashboard.mission.mission_01"), completed: hasSnapshot },
                                { id: 2, title: t("dashboard.mission.mission_02"), completed: false },
                                { id: 3, title: "Initialize Cashflow OS", completed: false }
                            ].map((mission) => (
                                <div key={mission.id} className="flex items-center gap-4 bg-zinc-950/50 border border-zinc-800 p-5 rounded-2xl group hover:border-zinc-700 transition-colors">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${mission.completed ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-700 group-hover:border-zinc-500'}`}>
                                        {mission.completed && <CheckCircle2 className="w-4 h-4 text-black" />}
                                    </div>
                                    <span className={`font-bold ${mission.completed ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>{mission.title}</span>
                                    {mission.id === 1 && !hasSnapshot && (
                                        <div className="ml-auto">
                                            <Badge variant="success" className="animate-pulse">Active</Badge>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Sidebar Column */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Quick Actions */}
                    <Card glow className="p-8 relative overflow-hidden">
                        <h3 className="text-lg font-black uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
                            <LayoutGrid className="w-4 h-4" />
                            {t("dashboard.quick_actions.title")}
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            <button className="flex items-center gap-4 p-4 bg-zinc-950 border border-zinc-800 rounded-2xl hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group text-left">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                    <PlusCircle className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-sm tracking-tight">{t("dashboard.quick_actions.add_expense")}</p>
                                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-0.5">Automated Tracking</p>
                                </div>
                            </button>
                            <button className="flex items-center gap-4 p-4 bg-zinc-950 border border-zinc-800 rounded-2xl hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group text-left">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-sm tracking-tight">{t("dashboard.quick_actions.update_debt")}</p>
                                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-0.5">Recalculate Sniper</p>
                                </div>
                            </button>
                            <Link href="/app/budget" className="flex items-center gap-4 p-4 bg-zinc-950 border border-zinc-800 rounded-2xl hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group text-left">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-sm tracking-tight">{t("dashboard.quick_actions.view_budget")}</p>
                                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-0.5">Envelopes Status</p>
                                </div>
                            </Link>
                            <button className="flex items-center gap-4 p-4 bg-red-500/5 border border-red-500/20 rounded-2xl hover:bg-red-500/10 transition-all group text-left">
                                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                                    <AlertCircle className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-sm tracking-tight text-red-400">{t("dashboard.quick_actions.emergency_sos")}</p>
                                    <p className="text-[10px] text-red-900 font-black uppercase tracking-widest mt-0.5">Panic Mode</p>
                                </div>
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
            <PushNotificationPrompt />
        </div>
    );
}
