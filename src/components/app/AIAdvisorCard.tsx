'use client';

import { useState } from 'react';
import { Sparkles, Brain, AlertTriangle, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFinancialAdvice } from '@/actions/ai';

interface AIAdvisorProps {
    income: number;
    expenses: number;
    debt: number;
}

export default function AIAdvisorCard({ income, expenses, debt }: AIAdvisorProps) {
    const [loading, setLoading] = useState(false);
    const [advice, setAdvice] = useState<any>(null);
    const [error, setError] = useState('');

    const handleAnalyze = async () => {
        setLoading(true);
        setError('');

        try {
            const result = await getFinancialAdvice({
                monthlyIncome: income,
                monthlyExpenses: expenses,
                totalDebt: debt
            });

            if (result.success) {
                setAdvice(result.data);
            } else {
                setError(result.message || 'Analysis failed');
            }
        } catch (err) {
            setError('Connection failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-zinc-900 border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">AI Financial Vision</h3>
                    <p className="text-zinc-400 text-xs">Powered by OpenAI GPT-4o</p>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {!advice ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                    >
                        <p className="text-zinc-300 text-sm">
                            Get an instant, unbiased analysis of your financial situation based on your current numbers.
                        </p>

                        <div className="grid grid-cols-3 gap-2 text-xs text-zinc-500 mb-4">
                            <div className="bg-zinc-900/50 p-2 rounded-lg text-center">
                                <span className="block text-zinc-300">Income</span>
                                R{income.toLocaleString()}
                            </div>
                            <div className="bg-zinc-900/50 p-2 rounded-lg text-center">
                                <span className="block text-zinc-300">Debt</span>
                                R{debt.toLocaleString()}
                            </div>
                            <div className="bg-zinc-900/50 p-2 rounded-lg text-center">
                                <span className="block text-zinc-300">Expenses</span>
                                R{expenses.toLocaleString()}
                            </div>
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Analyze My Finances
                                </>
                            )}
                        </button>

                        {error && (
                            <p className="text-red-400 text-xs text-center mt-2 flex items-center justify-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> {error}
                            </p>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${advice.status === 'Critical' ? 'bg-red-500/20 text-red-400' :
                                    advice.status === 'Warning' ? 'bg-orange-500/20 text-orange-400' :
                                        advice.status === 'Stable' ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-emerald-500/20 text-emerald-400'
                                }`}>
                                {advice.status}
                            </span>
                            <span className="text-2xl font-bold text-white">{advice.health_score}/100</span>
                        </div>

                        <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                            <h4 className="text-indigo-400 text-sm font-semibold mb-2 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                AI Assessment
                            </h4>
                            <p className="text-zinc-300 text-sm leading-relaxed">
                                "{advice.advice}"
                            </p>
                        </div>

                        <div className="bg-emerald-900/10 p-4 rounded-xl border border-emerald-500/20">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-emerald-400 text-sm font-semibold mb-1">
                                        Recommended Action
                                    </h4>
                                    <p className="text-zinc-200 text-sm font-medium">
                                        {advice.immediate_action}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setAdvice(null)}
                            className="w-full text-zinc-400 hover:text-white text-xs py-2 transition-colors flex items-center justify-center gap-1 group"
                        >
                            Run analysis again <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
