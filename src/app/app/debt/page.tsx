"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import {
    Target,
    TrendingDown,
    ShieldCheck,
    Zap,
    Info,
    Copy,
    Check,
    ArrowRight,
    Lock,
    Unlock,
    ChevronDown,
    ChevronUp
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { createNotification } from "@/lib/notifications";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface Debt {
    id: string;
    name: string;
    current_balance: number;
    interest_rate: number;
    minimum_payment: number;
}

export default function DebtSniperPage() {
    const { t, language } = useLanguage();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [debts, setDebts] = useState<Debt[]>([]);
    const [surplus, setSurplus] = useState(0);
    const [strategy, setStrategy] = useState<'snowball' | 'avalanche'>('snowball');
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const checkMilestones = async (debtName: string, newBalance: number) => {
        if (!user || newBalance > 0) return;

        const title = language === 'pt' ? '🎉 Vitória Financeira!' : '🎉 Financial Victory!';
        const message = language === 'pt'
            ? `Parabéns! Você acaba de quitar sua dívida de "${debtName}". Menos uma no caminho para a liberdade!`
            : `Congratulations! You just paid off your "${debtName}" debt. One less on the path to freedom!`;

        await createNotification(user.id, 'success', title, message);
    };

    const markAsPaid = async (debt: Debt) => {
        if (!user) return;
        const supabase = getSupabaseBrowserClient();

        const { error } = await supabase
            .from('debts')
            .update({ current_balance: 0 })
            .eq('id', debt.id);

        if (!error) {
            setDebts(prev => prev.map(d => d.id === debt.id ? { ...d, current_balance: 0 } : d));
            await checkMilestones(debt.name, 0);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            const supabase = getSupabaseBrowserClient();

            // Fetch Debts
            const { data: debtsData } = await supabase
                .from('debts')
                .select('*')
                .eq('user_id', user.id);

            if (debtsData) setDebts(debtsData);

            // Fetch Financial Snapshot (for surplus)
            const { data: snapshotData } = await supabase
                .from('financial_snapshots')
                .select('monthly_income, additional_income, total_fixed_expenses')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (snapshotData) {
                const totalIn = Number(snapshotData.monthly_income) + Number(snapshotData.additional_income);
                const totalOut = Number(snapshotData.total_fixed_expenses);
                setSurplus(totalIn - totalOut);
            }

            setLoading(false);
        };

        fetchData();
    }, [user]);

    const sortedDebts = [...debts].sort((a, b) => {
        if (strategy === 'snowball') {
            return a.current_balance - b.current_balance;
        } else {
            return b.interest_rate - a.interest_rate;
        }
    });

    const calculatePayoff = (debtsToCalculate: Debt[], monthlyExtra: number) => {
        let currentDebts = debtsToCalculate.map(d => ({ ...d, balance: d.current_balance }));
        const projectionData = [];
        let month = 0;
        let totalBalance = currentDebts.reduce((sum, d) => sum + d.balance, 0);
        let totalInterestPaid = 0;

        while (totalBalance > 0 && month < 120) {
            projectionData.push({
                month: month,
                balance: Math.round(totalBalance)
            });

            let monthlyPool = monthlyExtra + currentDebts.reduce((sum, d) => sum + d.minimum_payment, 0);

            for (let d of currentDebts) {
                if (d.balance > 0) {
                    const interest = (d.balance * (d.interest_rate / 100)) / 12;
                    totalInterestPaid += interest;
                    d.balance += interest;
                    const minPayment = Math.min(d.balance, d.minimum_payment);
                    d.balance -= minPayment;
                    monthlyPool -= minPayment;
                }
            }

            const target = currentDebts.find(d => d.balance > 0);
            if (target && monthlyPool > 0) {
                const extraPay = Math.min(target.balance, monthlyPool);
                target.balance -= extraPay;
            }

            totalBalance = currentDebts.reduce((sum, d) => sum + d.balance, 0);
            month++;
        }

        return { projectionData, totalInterestPaid, totalMonths: month };
    };

    const sniperResult = calculatePayoff(sortedDebts, surplus > 0 ? surplus : 0);
    const bankResult = calculatePayoff(sortedDebts, 0);

    const mergedData = bankResult.projectionData.map((d, i) => ({
        month: d.month,
        bank: d.balance,
        sniper: sniperResult.projectionData[i]?.balance ?? 0
    }));

    const interestSaved = Math.max(0, Math.round(bankResult.totalInterestPaid - sniperResult.totalInterestPaid));
    const timeSaved = Math.max(0, bankResult.totalMonths - sniperResult.totalMonths);

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-8">
            <header className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <Target className="w-6 h-6 text-black" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">{t("debt_sniper.title")}</h1>
                        <p className="text-zinc-500">{t("debt_sniper.subtitle")}</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                <Card glow className="p-6">
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Debt</p>
                    <p className="text-2xl font-black text-white">R {debts.reduce((sum, d) => sum + d.current_balance, 0).toLocaleString()}</p>
                </Card>
                <Card glow className="p-6">
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Sniper Surplus</p>
                    <p className="text-2xl font-black text-emerald-400">R {surplus.toLocaleString()}</p>
                </Card>
                <Card glow className="p-6">
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Interest Saved</p>
                    <p className="text-2xl font-black text-emerald-400">R {interestSaved.toLocaleString()}</p>
                </Card>
                <Card glow variant="success" className="p-6">
                    <p className="text-zinc-300 text-[10px] font-black uppercase tracking-widest mb-1">Months to Freedom</p>
                    <p className="text-2xl font-black text-white">{sniperResult.totalMonths} <span className="text-xs opacity-70 font-bold uppercase tracking-wider ml-1">Months</span></p>
                </Card>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Left Column: Strategy & Ladder */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Strategy Selector */}
                    <Card glow className="p-6">
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-emerald-500" />
                            {t("debt_sniper.strategy.title")}
                        </h2>
                        <div className="grid gap-4">
                            <button
                                onClick={() => setStrategy('snowball')}
                                className={`p-4 rounded-2xl border transition-all text-left ${strategy === 'snowball' ? 'bg-emerald-500/10 border-emerald-500 shadow-xl shadow-emerald-500/5' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'}`}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span className={`font-bold ${strategy === 'snowball' ? 'text-emerald-400' : 'text-zinc-300'}`}>
                                        {t("debt_sniper.strategy.snowball")}
                                    </span>
                                    {strategy === 'snowball' && <Unlock className="w-4 h-4 text-emerald-500" />}
                                </div>
                                <p className="text-xs text-zinc-500">{t("debt_sniper.strategy.snowball_desc")}</p>
                            </button>
                            <button
                                onClick={() => setStrategy('avalanche')}
                                className={`p-4 rounded-2xl border transition-all text-left ${strategy === 'avalanche' ? 'bg-emerald-500/10 border-emerald-500 shadow-xl shadow-emerald-500/5' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'}`}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span className={`font-bold ${strategy === 'avalanche' ? 'text-emerald-400' : 'text-zinc-300'}`}>
                                        {t("debt_sniper.strategy.avalanche")}
                                    </span>
                                    {strategy === 'avalanche' && <Unlock className="w-4 h-4 text-emerald-500" />}
                                </div>
                                <p className="text-xs text-zinc-500">{t("debt_sniper.strategy.avalanche_desc")}</p>
                            </button>
                        </div>
                    </Card>

                    {/* Priority Ladder */}
                    <Card className="p-6">
                        <h2 className="text-lg font-bold mb-6">{t("debt_sniper.ladder.title")}</h2>
                        <div className="space-y-4">
                            {sortedDebts.map((debt, i) => (
                                <motion.div
                                    key={debt.id}
                                    layout
                                    className={`p-4 rounded-2xl border ${i === 0 ? 'bg-red-500/5 border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.05)]' : 'bg-zinc-950/50 border-white/5'}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant={i === 0 ? "danger" : "ghost"}>
                                            {i === 0 ? t("debt_sniper.ladder.threat") : `${t("debt_sniper.ladder.next")} ${i}`}
                                        </Badge>
                                        <span className="text-[10px] text-zinc-500 font-bold uppercase">{debt.interest_rate}% APR</span>
                                    </div>
                                    <h3 className="font-bold text-white mb-1">{debt.name}</h3>
                                    <div className="flex justify-between items-end">
                                        <p className="text-xl font-black">R {debt.current_balance.toLocaleString()}</p>
                                        <p className="text-[10px] text-zinc-500 font-bold">Min: R {debt.minimum_payment}</p>
                                    </div>
                                    {i === 0 && debt.current_balance > 0 && surplus > 0 && (
                                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                                            <Zap className="w-3 h-3 fill-emerald-400" /> sniper shot: +R {surplus}
                                        </div>
                                    )}
                                    {i === 0 && debt.current_balance > 0 && (
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => markAsPaid(debt)}
                                            className="mt-4 w-full"
                                        >
                                            {language === 'pt' ? 'Marcar como Pago' : 'Mark as Paid'}
                                        </Button>
                                    )}
                                    {debt.current_balance === 0 && (
                                        <div className="mt-4 flex items-center justify-center gap-2 py-2 bg-emerald-500/10 rounded-xl text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                                            <ShieldCheck className="w-4 h-4" /> {language === 'pt' ? 'Quitada!' : 'Paid Off!'}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Right Column: Projections & Scripts */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Payoff Projection Chart */}
                    <Card glow className="p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight mb-1">{t("debt_sniper.projection.title")}</h2>
                                <p className="text-zinc-500 text-sm">{t("debt_sniper.projection.subtitle")}</p>
                            </div>
                            <div className="text-left md:text-right bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-2xl min-w-[200px]">
                                <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mb-1">{t("debt_sniper.projection.interest_saved")}</p>
                                <p className="text-3xl font-black text-white">R {interestSaved.toLocaleString()}*</p>
                                <p className="text-[10px] text-zinc-400 font-bold mt-1">*{timeSaved} months faster with Sniper-X</p>
                            </div>
                        </div>

                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={mergedData}>
                                    <defs>
                                        <linearGradient id="colorBank" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#71717a" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#71717a" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorSniper" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        stroke="#52525b"
                                        fontSize={12}
                                        tickFormatter={(val) => `Mo ${val}`}
                                    />
                                    <YAxis
                                        stroke="#52525b"
                                        fontSize={12}
                                        tickFormatter={(val) => `R${val / 1000}k`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="bank"
                                        name={t("debt_sniper.projection.bank_path")}
                                        stroke="#71717a"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorBank)"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="sniper"
                                        name={t("debt_sniper.projection.sniper_path")}
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorSniper)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Negotiation Scripts */}
                    <Card className="p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">{t("debt_sniper.scripts.title")}</h2>
                                <p className="text-zinc-500 text-sm">{t("debt_sniper.scripts.subtitle")}</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                {
                                    title: "Interest Rate Reduction",
                                    body: "Hello, I've been a loyal customer for X years. I'm currently reviewing my finances and noticed my interest rate is XX%. I've received offers from other institutions for a lower rate, but I'd prefer to stay with you. Can we discuss lowering my current rate to stay competitive?",
                                    icon: TrendingDown
                                },
                                {
                                    title: "Settlement Offer",
                                    body: "I am contacting you regarding account X. I am currently in a position to make a one-time lump sum payment to settle this debt in full. I can offer RX,XXX (approx 50-60% of balance) as a full and final settlement. Please let me know if we can close this account today.",
                                    icon: ShieldCheck
                                }
                            ].map((script, i) => (
                                <div key={i} className="bg-zinc-950/50 border border-white/5 p-6 rounded-2xl flex flex-col justify-between hover:border-blue-500/20 transition-colors">
                                    <div>
                                        <h3 className="font-bold flex items-center gap-2 mb-4 text-white">
                                            <script.icon className="w-4 h-4 text-blue-400" />
                                            {script.title}
                                        </h3>
                                        <p className="text-zinc-400 text-sm leading-relaxed italic border-l-2 border-zinc-800 pl-4 mb-8">
                                            "{script.body}"
                                        </p>
                                    </div>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        icon={copiedIndex === i ? Check : Copy}
                                        onClick={() => copyToClipboard(script.body, i)}
                                        className="w-full"
                                    >
                                        {copiedIndex === i ? t("debt_sniper.scripts.copied") : t("debt_sniper.scripts.copy")}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
