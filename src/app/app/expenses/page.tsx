'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import {
    Plus,
    TrendingUp,
    Calendar,
    Filter,
    Search,
    ShoppingCart,
    Utensils,
    Car,
    Home,
    Zap,
    Heart,
    DollarSign,
    MoreHorizontal,
    Edit,
    Trash2,
    PieChart,
    BarChart3,
    LineChart,
    LayoutGrid,
    CheckCircle2,
    AlertTriangle
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths, isToday, isYesterday, parseISO } from 'date-fns';
import { createNotification } from '@/lib/notifications';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';

interface Expense {
    id: string;
    category: string;
    amount: number;
    description: string | null;
    expense_date: string;
    is_recurring: boolean;
    created_at: string;
}

const CATEGORY_ICONS: Record<string, any> = {
    food: Utensils,
    transport: Car,
    housing: Home,
    utilities: Zap,
    entertainment: Heart,
    shopping: ShoppingCart,
    healthcare: Heart,
    other: MoreHorizontal
};

const CATEGORY_COLORS: Record<string, string> = {
    food: 'from-orange-500 to-red-500',
    transport: 'from-blue-500 to-cyan-500',
    housing: 'from-purple-500 to-pink-500',
    utilities: 'from-yellow-500 to-orange-500',
    entertainment: 'from-pink-500 to-rose-500',
    shopping: 'from-green-500 to-emerald-500',
    healthcare: 'from-red-500 to-pink-500',
    other: 'from-gray-500 to-slate-500'
};

export default function ExpensesPage() {
    const { t } = useLanguage();
    const supabase = getSupabaseBrowserClient();

    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('month');

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('expenses')
                .select('*')
                .eq('user_id', user.id)
                .order('expense_date', { ascending: false })
                .limit(100);

            if (error) throw error;
            setExpenses(data || []);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteExpense = async (id: string) => {
        try {
            const { error } = await supabase
                .from('expenses')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setExpenses(expenses.filter(e => e.id !== id));
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };

    // Calculate quick stats
    const calculateStats = () => {
        const now = new Date();
        const todayExpenses = expenses.filter(e => isToday(parseISO(e.expense_date)));
        const monthExpenses = expenses.filter(e => {
            const date = parseISO(e.expense_date);
            return date >= startOfMonth(now) && date <= endOfMonth(now);
        });

        return {
            today: todayExpenses.reduce((sum, e) => sum + Number(e.amount), 0),
            month: monthExpenses.reduce((sum, e) => sum + Number(e.amount), 0),
            count: monthExpenses.length
        };
    };

    const stats = calculateStats();

    // Group expenses by date
    const groupedExpenses = expenses.reduce((groups: Record<string, Expense[]>, expense) => {
        const date = parseISO(expense.expense_date);
        let label = format(date, 'yyyy-MM-dd');

        if (isToday(date)) label = t('expenses.list.date_today');
        else if (isYesterday(date)) label = t('expenses.list.date_yesterday');
        else label = format(date, 'EEEE, MMM dd');

        if (!groups[label]) groups[label] = [];
        groups[label].push(expense);
        return groups;
    }, {});

    const filteredGroups = Object.entries(groupedExpenses).reduce((acc, [date, exps]) => {
        const filtered = exps.filter(e => {
            const matchesCategory = filterCategory === 'all' || e.category === filterCategory;
            const matchesSearch = !searchQuery ||
                e.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                e.category.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
        if (filtered.length > 0) acc[date] = filtered;
        return acc;
    }, {} as Record<string, Expense[]>);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold text-white mb-2">
                        {t('expenses.title', 'Expense Tracker')}
                    </h1>
                    <p className="text-zinc-400">
                        {t('expenses.subtitle', 'Track every Rand. Control your future.')}
                    </p>
                </motion.div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card glow className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-zinc-400 text-sm">{t('expenses.stats.today')}</span>
                            <Calendar className="w-5 h-5 text-emerald-500" />
                        </div>
                        <p className="text-3xl font-bold text-white">R {stats.today.toFixed(2)}</p>
                    </Card>

                    <Card glow className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-zinc-400 text-sm">{t('expenses.stats.month')}</span>
                            <TrendingUp className="w-5 h-5 text-blue-500" />
                        </div>
                        <p className="text-3xl font-bold text-white">R {stats.month.toFixed(2)}</p>
                    </Card>

                    <Card glow className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-zinc-400 text-sm">{t('expenses.stats.transactions')}</span>
                            <BarChart3 className="w-5 h-5 text-purple-500" />
                        </div>
                        <p className="text-3xl font-bold text-white">{stats.count}</p>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <Input
                            icon={Search}
                            placeholder={t('expenses.search_placeholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                    >
                        <option value="all">{t('expenses.filters.all_categories')}</option>
                        <option value="food">{t('expenses.filters.food')}</option>
                        <option value="transport">{t('expenses.filters.transport')}</option>
                        <option value="housing">{t('expenses.filters.housing')}</option>
                        <option value="utilities">{t('expenses.filters.utilities')}</option>
                        <option value="entertainment">{t('expenses.filters.entertainment')}</option>
                        <option value="shopping">{t('expenses.filters.shopping')}</option>
                        <option value="healthcare">{t('expenses.filters.healthcare')}</option>
                        <option value="other">{t('expenses.filters.other')}</option>
                    </select>
                </div>

                {/* Expense List */}
                <div className="space-y-6">
                    {Object.entries(filteredGroups).length === 0 ? (
                        <div className="text-center py-12">
                            <DollarSign className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                            <p className="text-zinc-400">{t('expenses.list.empty_title')}</p>
                            <p className="text-zinc-500 text-sm mt-2">{t('expenses.list.empty_subtitle')}</p>
                        </div>
                    ) : (
                        Object.entries(filteredGroups).map(([date, exps]) => (
                            <div key={date}>
                                <h3 className="text-zinc-400 text-sm font-semibold mb-3">{date}</h3>
                                <div className="space-y-2">
                                    {exps.map((expense, index) => {
                                        const Icon = CATEGORY_ICONS[expense.category] || MoreHorizontal;
                                        return (
                                            <motion.div
                                                key={expense.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-xl p-4 flex items-center justify-between hover:border-zinc-700 transition-colors group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${CATEGORY_COLORS[expense.category]} flex items-center justify-center`}>
                                                        <Icon className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-semibold capitalize">
                                                            {t(`expenses.filters.${expense.category}`, expense.category)}
                                                        </p>
                                                        {expense.description && (
                                                            <p className="text-zinc-400 text-sm">{expense.description}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <p className="text-white font-bold text-lg">R {Number(expense.amount).toFixed(2)}</p>
                                                    <button
                                                        onClick={() => deleteExpense(expense.id)}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-400"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Floating Action Button */}
                <Button
                    icon={Plus}
                    size="icon"
                    onClick={() => setShowQuickAdd(true)}
                    className="fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-2xl shadow-emerald-500/50 z-50 hover:scale-110 active:scale-95"
                />
            </div>

            {/* Quick Add Modal - Will be a separate component */}
            {showQuickAdd && (
                <QuickAddModal
                    onClose={() => setShowQuickAdd(false)}
                    onSuccess={() => {
                        fetchExpenses();
                        setShowQuickAdd(false);
                    }}
                />
            )}
        </div>
    );
}

// Quick Add Modal Component (simplified version)
function QuickAddModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
    const { t, language } = useLanguage();
    const supabase = getSupabaseBrowserClient();
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('food');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || parseFloat(amount) <= 0) return;

        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { error } = await supabase.from('expenses').insert({
                user_id: user.id,
                amount: parseFloat(amount),
                category,
                description: description || null,
                expense_date: new Date().toISOString().split('T')[0],
                is_recurring: false
            });

            if (error) throw error;

            // --- Gatilho de Notificação de Orçamento ---
            const monthYear = new Date().toISOString().slice(0, 7); // YYYY-MM
            const { data: budget } = await supabase
                .from('budget_categories')
                .select('*')
                .eq('user_id', user.id)
                .eq('name', category)
                .eq('month_year', monthYear)
                .single();

            if (budget) {
                const { data: allExpenses } = await supabase
                    .from('expenses')
                    .select('amount')
                    .eq('user_id', user.id)
                    .eq('category', category)
                    .gte('expense_date', `${monthYear}-01`);

                const totalSpent = (allExpenses || []).reduce((sum: number, e: any) => sum + Number(e.amount), 0);

                if (totalSpent > Number(budget.allocated_amount)) {
                    await createNotification(
                        user.id,
                        'warning',
                        language === 'pt' ? '⚠️ Orçamento Estourado!' : '⚠️ Budget Exceeded!',
                        language === 'pt'
                            ? `Você ultrapassou seu orçamento de "${category}" para este mês.`
                            : `You have exceeded your "${category}" budget for this month.`
                    );
                }
            }
            // -------------------------------------------

            onSuccess();
        } catch (error) {
            console.error('Error adding expense:', error);
            alert('Failed to add expense');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <Card
                glow
                onClick={(e) => e.stopPropagation()}
                className="max-w-md w-full p-8"
            >
                <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">{t('expenses.add_modal.title')}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label={t('expenses.add_modal.amount_label')}
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="text-2xl font-black text-emerald-400"
                        placeholder="0.00"
                        autoFocus
                    />

                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1">
                            {t('expenses.add_modal.category_label')}
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-bold"
                        >
                            <option value="food">{t('expenses.filters.food')}</option>
                            <option value="transport">{t('expenses.filters.transport')}</option>
                            <option value="housing">{t('expenses.filters.housing')}</option>
                            <option value="utilities">{t('expenses.filters.utilities')}</option>
                            <option value="entertainment">{t('expenses.filters.entertainment')}</option>
                            <option value="shopping">{t('expenses.filters.shopping')}</option>
                            <option value="healthcare">{t('expenses.filters.healthcare')}</option>
                            <option value="other">{t('expenses.filters.other')}</option>
                        </select>
                    </div>

                    <Input
                        label={t('expenses.add_modal.description_label')}
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={t('expenses.add_modal.description_placeholder')}
                    />

                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="flex-1"
                        >
                            {t('expenses.add_modal.cancel_btn')}
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={loading}
                            disabled={!amount}
                            className="flex-1"
                        >
                            {t('expenses.add_modal.submit_btn')}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
