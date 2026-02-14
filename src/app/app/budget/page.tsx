"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import {
    Wallet,
    Plus,
    ArrowRight,
    TrendingUp,
    PieChart,
    AlertCircle,
    ChevronRight,
    History,
    Edit3,
    CheckCircle2,
    X,
    ArrowDownRight,
    ArrowUpRight
} from "lucide-react";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { format } from "date-fns";

type Envelope = {
    id: string;
    name: string;
    allocated_amount: number;
    spent_amount: number;
};

export default function BudgetPage() {
    const { t } = useLanguage();
    const { user } = useAuth();
    const [envelopes, setEnvelopes] = useState<Envelope[]>([]);
    const [loading, setLoading] = useState(true);
    const [initializing, setInitializing] = useState(false);
    const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
    const [isEditAllocationOpen, setIsEditAllocationOpen] = useState(false);
    const [selectedEnvelope, setSelectedEnvelope] = useState<Envelope | null>(null);
    const [expenseAmount, setExpenseAmount] = useState("");
    const [expenseDesc, setExpenseDesc] = useState("");
    const [newAllocation, setNewAllocation] = useState("");

    const currentMonth = format(new Date(), "yyyy-MM");

    useEffect(() => {
        fetchBudget();
    }, [user]);

    const fetchBudget = async () => {
        if (!user) return;
        setLoading(true);
        const supabase = getSupabaseBrowserClient();

        const { data, error } = await supabase
            .from("budget_categories")
            .select("*")
            .eq("user_id", user.id)
            .eq("month_year", currentMonth);

        if (error) {
            console.error("Error fetching budget:", error);
        } else {
            setEnvelopes(data || []);
        }
        setLoading(false);
    };

    const initializeBudget = async () => {
        if (!user) return;
        setInitializing(true);
        const supabase = getSupabaseBrowserClient();

        // Fetch snapshot for default allocations
        const { data: snapshot } = await supabase
            .from("financial_snapshots")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        // Default categories if nothing found or to complement
        const defaultCategories = [
            { name: "housing", amount: 0 },
            { name: "food", amount: 0 },
            { name: "transport", amount: 0 },
            { name: "utilities", amount: 0 },
            { name: "entertainment", amount: 0 },
            { name: "other", amount: 0 }
        ];

        // If we have a snapshot, we could try to parse or just give them a fresh start
        // Better: just initialize with empty categories and let user adjust
        const categoriesToInsert = defaultCategories.map(cat => ({
            user_id: user.id,
            name: cat.name,
            allocated_amount: 0,
            spent_amount: 0,
            month_year: currentMonth
        }));

        const { error } = await supabase.from("budget_categories").insert(categoriesToInsert);

        if (error) {
            console.error("Error initializing budget:", error);
        } else {
            fetchBudget();
        }
        setInitializing(false);
    };

    const handleLogExpense = async () => {
        if (!user || !selectedEnvelope || !expenseAmount) return;
        const amount = Number(expenseAmount);
        const supabase = getSupabaseBrowserClient();

        // 1. Create Expense record
        const { error: expError } = await supabase.from("expenses").insert({
            user_id: user.id,
            category: selectedEnvelope.name,
            amount: amount,
            description: expenseDesc,
            expense_date: format(new Date(), "yyyy-MM-dd")
        });

        if (expError) {
            console.error("Error logging expense:", expError);
            return;
        }

        // 2. Update Budget Category spent_amount
        const { error: budError } = await supabase
            .from("budget_categories")
            .update({ spent_amount: (selectedEnvelope.spent_amount || 0) + amount })
            .eq("id", selectedEnvelope.id);

        if (budError) {
            console.error("Error updating budget:", budError);
        } else {
            setIsAddExpenseOpen(false);
            setExpenseAmount("");
            setExpenseDesc("");
            fetchBudget();
        }
    };

    const handleUpdateAllocation = async () => {
        if (!user || !selectedEnvelope || !newAllocation) return;
        const amount = Number(newAllocation);
        const supabase = getSupabaseBrowserClient();

        const { error } = await supabase
            .from("budget_categories")
            .update({ allocated_amount: amount })
            .eq("id", selectedEnvelope.id);

        if (error) {
            console.error("Error updating allocation:", error);
        } else {
            setIsEditAllocationOpen(false);
            setNewAllocation("");
            fetchBudget();
        }
    };

    const totalAllocated = envelopes.reduce((sum, env) => sum + Number(env.allocated_amount), 0);
    const totalSpent = envelopes.reduce((sum, env) => sum + Number(env.spent_amount), 0);
    const remaining = totalAllocated - totalSpent;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-10 h-10 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-8">
            <header className="mb-12 flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
                            <PieChart className="w-5 h-5 text-emerald-500" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight">{t("dashboard.budget_system.title")}</h1>
                    </div>
                    <p className="text-zinc-500 max-w-xl">{t("dashboard.budget_system.subtitle")}</p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors">
                        <History className="w-4 h-4" /> {t("dashboard.budget_system.actions.view_history")}
                    </button>
                    <button
                        onClick={() => {
                            if (envelopes.length > 0) setSelectedEnvelope(envelopes[0]);
                            setIsAddExpenseOpen(true);
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-black font-black rounded-xl hover:scale-105 transition-all shadow-xl shadow-emerald-500/20"
                    >
                        <Plus className="w-5 h-5" /> {t("dashboard.budget_system.actions.add_expense")}
                    </button>
                </div>
            </header>

            {envelopes.length === 0 ? (
                <div className="bg-zinc-900/50 border-2 border-dashed border-zinc-800 rounded-[3rem] p-24 text-center">
                    <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-8">
                        <Wallet className="w-10 h-10 text-zinc-600" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">{t("dashboard.budget_system.envelopes.empty")}</h2>
                    <button
                        onClick={initializeBudget}
                        disabled={initializing}
                        className="px-10 py-4 bg-emerald-500 text-black font-black rounded-2xl hover:scale-105 transition-all disabled:opacity-50"
                    >
                        {initializing ? t("common.loading") : t("dashboard.budget_system.envelopes.init_cta")}
                    </button>
                </div>
            ) : (
                <div className="space-y-12">
                    {/* Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl shadow-xl">
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{t("dashboard.budget_system.overview.total_allocated")}</p>
                            <h3 className="text-3xl font-black text-white">R {totalAllocated.toLocaleString()}</h3>
                        </div>
                        <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl shadow-xl">
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{t("dashboard.budget_system.overview.total_spent")}</p>
                            <h3 className="text-3xl font-black text-red-500">R {totalSpent.toLocaleString()}</h3>
                        </div>
                        <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl shadow-xl border-emerald-500/20">
                            <p className="text-emerald-500/50 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{t("dashboard.budget_system.overview.remaining")}</p>
                            <h3 className="text-3xl font-black text-emerald-400">R {remaining.toLocaleString()}</h3>
                        </div>
                        <div className={`bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl shadow-xl ${remaining < 0 ? 'bg-red-500/5 border-red-500/20' : ''}`}>
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Efficiency</p>
                            <h3 className={`text-3xl font-black ${remaining < 0 ? 'text-red-500' : 'text-zinc-300'}`}>
                                {totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0}%
                            </h3>
                        </div>
                    </div>

                    {/* Envelopes Grid */}
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-widest text-zinc-500 mb-8 flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                            {t("dashboard.budget_system.envelopes.title")}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {envelopes.map((env) => {
                                const percent = Math.min(100, (env.spent_amount / env.allocated_amount) * 100);
                                const isDanger = percent >= 90;
                                const isOver = percent > 100;

                                return (
                                    <motion.div
                                        key={env.id}
                                        whileHover={{ y: -5 }}
                                        className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-8 shadow-xl relative overflow-hidden group"
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="space-y-1">
                                                <h3 className="text-xl font-black capitalize tracking-tight text-white group-hover:text-emerald-400 transition-colors">{env.name}</h3>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ${isOver ? 'bg-red-500/20 text-red-500' :
                                                            isDanger ? 'bg-orange-500/20 text-orange-500' :
                                                                'bg-emerald-500/20 text-emerald-500'
                                                        }`}>
                                                        {isOver ? t("dashboard.budget_system.envelopes.status.danger") :
                                                            isDanger ? t("dashboard.budget_system.envelopes.status.warning") :
                                                                t("dashboard.budget_system.envelopes.status.healthy")}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setSelectedEnvelope(env);
                                                    setNewAllocation(env.allocated_amount.toString());
                                                    setIsEditAllocationOpen(true);
                                                }}
                                                className="p-2 text-zinc-700 hover:text-zinc-300 transition-colors"
                                            >
                                                <Edit3 className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="mb-6">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-zinc-500 font-bold">R {env.spent_amount.toLocaleString()}</span>
                                                <span className="text-zinc-300 font-black">R {env.allocated_amount.toLocaleString()}</span>
                                            </div>
                                            <div className="w-full h-3 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/50">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${percent}%` }}
                                                    className={`h-full ${isOver ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' :
                                                            isDanger ? 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]' :
                                                                'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                                                        }`}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center pt-6 border-t border-zinc-800/50">
                                            <div>
                                                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Remaining</p>
                                                <p className={`font-black ${env.allocated_amount - env.spent_amount < 0 ? 'text-red-500' : 'text-zinc-300'}`}>
                                                    R {(env.allocated_amount - env.spent_amount).toLocaleString()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setSelectedEnvelope(env);
                                                    setIsAddExpenseOpen(true);
                                                }}
                                                className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-emerald-500 hover:border-emerald-500/20 transition-all"
                                            >
                                                <Plus className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Monthly Insight Sidebar/Bottom */}
                    <section className="bg-zinc-900/30 border border-zinc-800/50 rounded-3xl p-12 flex flex-col md:flex-row items-center gap-12">
                        <div className="w-24 h-24 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center text-emerald-500">
                            <TrendingUp className="w-12 h-12" />
                        </div>
                        <div className="flex-1 space-y-2">
                            <h3 className="text-2xl font-black tracking-tight">{t("dashboard.budget_system.summary.title")}</h3>
                            <p className="text-zinc-400">
                                You are currently spending <b>R {totalSpent.toLocaleString()}</b>. By cutting Miscellaneous by 10%, you could kill your <b>Credit Card</b> debt <b>2 months earlier</b>.
                            </p>
                        </div>
                        <button className="px-8 py-4 bg-zinc-950 border border-zinc-800 text-zinc-300 font-bold rounded-xl hover:text-white transition-colors flex items-center gap-2">
                            Analyze Patterns <ArrowRight className="w-4 h-4" />
                        </button>
                    </section>
                </div>
            )}

            {/* Add Expense Modal */}
            <AnimatePresence>
                {isAddExpenseOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddExpenseOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-12 w-full max-w-lg relative z-10 shadow-2xl"
                        >
                            <button
                                onClick={() => setIsAddExpenseOpen(false)}
                                className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <h2 className="text-3xl font-black mb-2">{t("dashboard.budget_system.actions.add_expense")}</h2>
                            <p className="text-zinc-500 mb-8 lowercase tracking-tight">Logging into <span className="text-emerald-500 font-bold uppercase">{selectedEnvelope?.name}</span> envelope</p>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Select Envelope</label>
                                    <select
                                        value={selectedEnvelope?.id}
                                        onChange={(e) => setSelectedEnvelope(envelopes.find(env => env.id === e.target.value) || null)}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 focus:outline-none focus:border-emerald-500 font-bold capitalize"
                                    >
                                        {envelopes.map(env => (
                                            <option key={env.id} value={env.id}>{env.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Amount (ZAR)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">R</span>
                                        <input
                                            type="number"
                                            value={expenseAmount}
                                            onChange={(e) => setExpenseAmount(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-6 pl-10 pr-6 text-4xl font-black focus:outline-none focus:border-emerald-500 transition-colors"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Notes (Optional)</label>
                                    <input
                                        type="text"
                                        value={expenseDesc}
                                        onChange={(e) => setExpenseDesc(e.target.value)}
                                        placeholder="e.g. Woolworths groceries"
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 focus:outline-none focus:border-emerald-500 font-medium"
                                    />
                                </div>

                                <button
                                    onClick={handleLogExpense}
                                    className="w-full py-5 bg-emerald-500 text-black font-black text-xl rounded-2xl hover:scale-105 transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
                                >
                                    Log Transaction
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Allocation Modal */}
            <AnimatePresence>
                {isEditAllocationOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditAllocationOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-12 w-full max-w-lg relative z-10 shadow-2xl"
                        >
                            <button
                                onClick={() => setIsEditAllocationOpen(false)}
                                className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <h2 className="text-3xl font-black mb-2">{t("dashboard.budget_system.actions.edit_allocation")}</h2>
                            <p className="text-zinc-500 mb-8 lowercase tracking-tight">Adjusting monthly limit for <span className="text-emerald-500 font-bold uppercase">{selectedEnvelope?.name}</span></p>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Tactical Allocation (ZAR)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">R</span>
                                        <input
                                            type="number"
                                            value={newAllocation}
                                            onChange={(e) => setNewAllocation(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-6 pl-10 pr-6 text-4xl font-black focus:outline-none focus:border-emerald-500 transition-colors"
                                            autoFocus
                                        />
                                    </div>
                                    <p className="mt-4 text-xs text-zinc-500 italic">
                                        Tip: Only allocate what you actually have. Telling your money where to go is the first step to freedom.
                                    </p>
                                </div>

                                <button
                                    onClick={handleUpdateAllocation}
                                    className="w-full py-5 bg-emerald-500 text-black font-black text-xl rounded-2xl hover:scale-105 transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
                                >
                                    Update Envelope
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
