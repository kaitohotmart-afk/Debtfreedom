"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import {
    Wallet,
    ChevronRight,
    ChevronLeft,
    Plus,
    Trash2,
    DollarSign,
    Calendar,
    AlertCircle,
    CheckCircle2,
    TrendingUp,
    ArrowRight
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function XRayPage() {
    const { t } = useLanguage();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Form State
    const [income, setIncome] = useState({
        monthly_salary: 0,
        additional_income: 0,
        description: ""
    });

    const [expenses, setExpenses] = useState<{ category: string, subcategory: string, amount: number }[]>([
        { category: "housing", subcategory: "Rent/Mortgage", amount: 0 },
        { category: "utilities", subcategory: "Electricity/Water", amount: 0 },
        { category: "transport", subcategory: "Fuel/Petrol", amount: 0 },
        { category: "food", subcategory: "Groceries", amount: 0 },
    ]);

    const [debts, setDebts] = useState<{ name: string, balance: number, rate: number, payment: number }[]>([
        { name: "Credit Card", balance: 0, rate: 18, payment: 0 },
    ]);

    const totalIncome = Number(income.monthly_salary) + Number(income.additional_income);
    const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    const totalDebts = debts.reduce((sum, d) => sum + Number(d.balance), 0);
    const gap = totalIncome - totalExpenses;

    const handleAddExpense = () => {
        setExpenses([...expenses, { category: "other", subcategory: "Miscellaneous", amount: 0 }]);
    };

    const handleRemoveExpense = (index: number) => {
        setExpenses(expenses.filter((_, i) => i !== index));
    };

    const handleAddDebt = () => {
        setDebts([...debts, { name: "", balance: 0, rate: 0, payment: 0 }]);
    };

    const handleRemoveDebt = (index: number) => {
        setDebts(debts.filter((_, i) => i !== index));
    };

    const handleFinish = async () => {
        setLoading(true);
        try {
            const supabase = getSupabaseBrowserClient();

            // 1. Save Financial Snapshot
            const { error: snapshotError } = await supabase
                .from('financial_snapshots')
                .insert({
                    user_id: user?.id,
                    monthly_income: income.monthly_salary,
                    additional_income: income.additional_income,
                    total_fixed_expenses: totalExpenses,
                    total_debt: totalDebts,
                });

            if (snapshotError) throw snapshotError;

            // 2. Save Debts
            if (debts.length > 0) {
                const debtsToSave = debts.map(d => ({
                    user_id: user?.id,
                    name: d.name,
                    current_balance: d.balance,
                    total_amount: d.balance,
                    interest_rate: d.rate,
                    minimum_payment: d.payment
                }));
                const { error: debtsError } = await supabase.from('debts').insert(debtsToSave);
                if (debtsError) throw debtsError;
            }

            setSubmitted(true);
        } catch (err) {
            console.error("Error saving X-Ray data:", err);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="max-w-4xl mx-auto py-12 text-center">
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/20">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold mb-4">{t("x_ray.summary.complete_title")}</h1>
                <p className="text-zinc-400 text-lg mb-12">
                    {t("x_ray.summary.complete_subtitle")} <span className={`font-bold ${gap > 0 ? 'text-emerald-400' : 'text-red-400'}`}>R {gap.toFixed(2)}</span> per month.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-12 text-left">
                    <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl">
                        <TrendingUp className="w-8 h-8 text-emerald-500 mb-4" />
                        <h3 className="text-xl font-bold mb-2">{t("x_ray.summary.good_news")}</h3>
                        <p className="text-zinc-400">
                            {gap > 0
                                ? t("x_ray.summary.good_news_surplus")
                                : t("x_ray.summary.good_news_deficit")
                            }
                        </p>
                    </div>
                    <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl">
                        <AlertCircle className="w-8 h-8 text-blue-500 mb-4" />
                        <h3 className="text-xl font-bold mb-2">{t("x_ray.summary.next_step")}</h3>
                        <p className="text-zinc-400">
                            {t("x_ray.summary.next_step_desc")}
                        </p>
                    </div>
                </div>

                <Link href="/app/dashboard" className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 text-black font-bold rounded-xl hover:scale-105 transition-transform">
                    {t("x_ray.summary.back_dashboard")} <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8">
            <header className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-emerald-500" />
                    </div>
                    <h1 className="text-3xl font-bold font-display tracking-tight">{t("x_ray.title")}</h1>
                </div>
                <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                    <motion.div
                        className="bg-emerald-500 h-full"
                        initial={{ width: "25%" }}
                        animate={{ width: `${(step / 4) * 100}%` }}
                    />
                </div>
            </header>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl shadow-xl">
                            <h2 className="text-2xl font-bold mb-2">{t("x_ray.income.title")}</h2>
                            <p className="text-zinc-500 mb-8">{t("x_ray.income.subtitle")}</p>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2 uppercase tracking-widest">{t("x_ray.income.primary")}</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">R</span>
                                        <input
                                            type="number"
                                            value={income.monthly_salary}
                                            onChange={(e) => setIncome({ ...income, monthly_salary: Number(e.target.value) })}
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-4 pl-10 pr-4 focus:outline-none focus:border-emerald-500 transition-colors text-xl font-bold"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2 uppercase tracking-widest">{t("x_ray.income.additional")}</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">R</span>
                                        <input
                                            type="number"
                                            value={income.additional_income}
                                            onChange={(e) => setIncome({ ...income, additional_income: Number(e.target.value) })}
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-4 pl-10 pr-4 focus:outline-none focus:border-emerald-500 transition-colors text-xl font-bold"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-2xl flex justify-between items-center">
                            <span className="text-zinc-400 font-medium">{t("x_ray.income.total")}:</span>
                            <span className="text-3xl font-black text-emerald-400">R {totalIncome.toLocaleString()}</span>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold">{t("x_ray.expenses.title")}</h2>
                                    <p className="text-zinc-500">{t("x_ray.expenses.subtitle")}</p>
                                </div>
                                <button
                                    onClick={handleAddExpense}
                                    className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500/20 transition-colors"
                                >
                                    <Plus className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {expenses.map((exp, i) => (
                                    <div key={i} className="flex gap-4 items-end">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={exp.subcategory}
                                                onChange={(e) => {
                                                    const newExp = [...expenses];
                                                    newExp[i].subcategory = e.target.value;
                                                    setExpenses(newExp);
                                                }}
                                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-emerald-500"
                                            />
                                        </div>
                                        <div className="w-32 relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">R</span>
                                            <input
                                                type="number"
                                                value={exp.amount}
                                                onChange={(e) => {
                                                    const newExp = [...expenses];
                                                    newExp[i].amount = Number(e.target.value);
                                                    setExpenses(newExp);
                                                }}
                                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 pl-8 focus:outline-none focus:border-emerald-500 font-bold"
                                            />
                                        </div>
                                        <button
                                            onClick={() => handleRemoveExpense(i)}
                                            className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">{t("x_ray.expenses.total_out")}</p>
                                <p className="text-2xl font-black text-red-400">R {totalExpenses.toLocaleString()}</p>
                            </div>
                            <div className={`bg-zinc-900 border border-zinc-800 p-6 rounded-2xl ${gap > 0 ? 'border-emerald-500/20' : 'border-red-500/20'}`}>
                                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">{t("x_ray.expenses.difference")}</p>
                                <p className={`text-2xl font-black ${gap > 0 ? 'text-emerald-400' : 'text-red-400'}`}>R {gap.toLocaleString()}</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold">{t("x_ray.debts.title")}</h2>
                                    <p className="text-zinc-500">{t("x_ray.debts.subtitle")}</p>
                                </div>
                                <button
                                    onClick={handleAddDebt}
                                    className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500/20 transition-colors"
                                >
                                    <Plus className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {debts.map((debt, i) => (
                                    <div key={i} className="bg-zinc-950/50 border border-zinc-800 p-6 rounded-2xl space-y-4">
                                        <div className="flex justify-between items-center">
                                            <input
                                                type="text"
                                                placeholder={t("x_ray.debts.name_placeholder")}
                                                value={debt.name}
                                                onChange={(e) => {
                                                    const newDebts = [...debts];
                                                    newDebts[i].name = e.target.value;
                                                    setDebts(newDebts);
                                                }}
                                                className="bg-transparent text-lg font-bold focus:outline-none border-b border-transparent focus:border-emerald-500"
                                            />
                                            <button onClick={() => handleRemoveDebt(i)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">{t("x_ray.debts.balance")}</label>
                                                <div className="relative">
                                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-700 text-xs">R</span>
                                                    <input
                                                        type="number"
                                                        value={debt.balance}
                                                        onChange={(e) => {
                                                            const newDebts = [...debts];
                                                            newDebts[i].balance = Number(e.target.value);
                                                            setDebts(newDebts);
                                                        }}
                                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 pl-6 focus:outline-none focus:border-emerald-500 font-bold"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">{t("x_ray.debts.rate")}</label>
                                                <input
                                                    type="number"
                                                    value={debt.rate}
                                                    onChange={(e) => {
                                                        const newDebts = [...debts];
                                                        newDebts[i].rate = Number(e.target.value);
                                                        setDebts(newDebts);
                                                    }}
                                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 focus:outline-none focus:border-emerald-500 font-bold"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-1">{t("x_ray.debts.min_payment")}</label>
                                                <div className="relative">
                                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-700 text-xs">R</span>
                                                    <input
                                                        type="number"
                                                        value={debt.payment}
                                                        onChange={(e) => {
                                                            const newDebts = [...debts];
                                                            newDebts[i].payment = Number(e.target.value);
                                                            setDebts(newDebts);
                                                        }}
                                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 pl-6 focus:outline-none focus:border-emerald-500 font-bold"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl flex justify-between items-center shadow-xl shadow-red-500/5">
                            <div>
                                <h3 className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-1">{t("x_ray.debts.total_owed")}</h3>
                                <p className="text-4xl font-black text-red-500">R {totalDebts.toLocaleString()}</p>
                            </div>
                            <AlertCircle className="w-12 h-12 text-red-500/20" />
                        </div>
                    </motion.div>
                )}

                {step === 4 && (
                    <motion.div
                        key="step4"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-8"
                    >
                        <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl text-center">
                            <h2 className="text-3xl font-bold mb-4">{t("x_ray.summary.title")}</h2>
                            <p className="text-zinc-500 mb-12">{t("x_ray.summary.subtitle")}</p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
                                    <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">{t("x_ray.income.title")}</p>
                                    <p className="font-bold text-emerald-400">R {totalIncome.toLocaleString()}</p>
                                </div>
                                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
                                    <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">{t("x_ray.expenses.title")}</p>
                                    <p className="font-bold text-red-400">R {totalExpenses.toLocaleString()}</p>
                                </div>
                                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
                                    <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">{t("x_ray.expenses.difference")}</p>
                                    <p className={`font-bold ${gap > 0 ? 'text-emerald-400' : 'text-red-400'}`}>R {gap.toLocaleString()}</p>
                                </div>
                                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
                                    <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">{t("x_ray.debts.total_owed")}</p>
                                    <p className="font-bold text-zinc-300">R {totalDebts.toLocaleString()}</p>
                                </div>
                            </div>

                            <button
                                onClick={handleFinish}
                                disabled={loading}
                                className="w-full py-5 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-black rounded-2xl shadow-2xl shadow-emerald-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {loading ? t("x_ray.summary.analyzing") : t("x_ray.summary.finish_cta")}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mt-12 flex justify-between items-center">
                <button
                    onClick={() => step > 1 && setStep(step - 1)}
                    disabled={step === 1 || loading}
                    className="flex items-center gap-2 px-6 py-3 text-zinc-500 hover:text-white transition-colors disabled:opacity-0"
                >
                    <ChevronLeft className="w-5 h-5" /> {t("common.back")}
                </button>
                {step < 4 && (
                    <button
                        onClick={() => setStep(step + 1)}
                        className="flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-emerald-500 hover:text-white transition-all group"
                    >
                        {t("common.next")} <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                )}
            </div>
        </div>
    );
}
