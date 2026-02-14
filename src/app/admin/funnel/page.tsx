'use client';

import { useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, MousePointer2, TrendingUp, AlertCircle } from 'lucide-react';

export default function AdminFunnelPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const supabase = getSupabaseBrowserClient();
    const [stats, setStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const ADMIN_EMAIL = 'kaitoluismiropo@gmail.com'; // Admin user email

    useEffect(() => {
        if (!authLoading) {
            if (!user || user.email !== ADMIN_EMAIL) {
                router.push('/signin');
                return;
            }
            fetchStats();
        }
    }, [user, authLoading]);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('analytics_events')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Process data for funnel
            const funnelSteps = [
                { name: 'Quiz Start', events: ['quiz_start'] },
                { name: 'Quiz Step 1', events: ['quiz_step_1'] },
                { name: 'Quiz Step 4', events: ['quiz_step_4'] },
                { name: 'Quiz Step 8', events: ['quiz_step_8'] },
                { name: 'Quiz Complete', events: ['quiz_complete'] },
                { name: 'Sales Page', events: ['view_content'] },
                { name: 'Init Checkout', events: ['initiate_checkout'] },
                { name: 'Purchase', events: ['purchase'] }
            ];

            const processedStats = funnelSteps.map(step => {
                const uniqueSessions = new Set(
                    data.filter((e: any) => step.events.includes(e.event_name)).map((e: any) => e.session_id)
                ).size;
                return { name: step.name, value: uniqueSessions };
            });

            setStats(processedStats);
        } catch (error) {
            console.error('Error fetching admin stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono">LOADING ADMIN DATA...</div>;
    }

    const totalStarts = stats[0]?.value || 0;
    const totalPurchases = stats[stats.length - 1]?.value || 0;
    const conversionRate = totalStarts > 0 ? ((totalPurchases / totalStarts) * 100).toFixed(2) : 0;

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <header className="mb-12">
                <div className="flex items-center gap-3 mb-2">
                    <Badge variant="danger">ADMIN ONLY</Badge>
                </div>
                <h1 className="text-4xl font-black uppercase tracking-tighter">Conversion Funnel</h1>
                <p className="text-zinc-500 font-mono text-sm">Real-time drop-off tracking</p>
            </header>

            {/* Top Grid Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Card glow className="p-8">
                    <div className="flex items-center gap-3 text-zinc-500 mb-4 font-mono text-xs uppercase tracking-widest">
                        <Users className="w-4 h-4" /> Uniq Sessions
                    </div>
                    <p className="text-4xl font-black">{totalStarts}</p>
                </Card>
                <Card glow className="p-8">
                    <div className="flex items-center gap-3 text-zinc-500 mb-4 font-mono text-xs uppercase tracking-widest">
                        <TrendingUp className="w-4 h-4" /> Conv Rate
                    </div>
                    <p className="text-4xl font-black text-emerald-500">{conversionRate}%</p>
                </Card>
                <Card glow variant="success" className="p-8">
                    <div className="flex items-center gap-3 text-white/50 mb-4 font-mono text-xs uppercase tracking-widest">
                        <MousePointer2 className="w-4 h-4" /> Total Sales
                    </div>
                    <p className="text-4xl font-black">{totalPurchases}</p>
                </Card>
            </div>

            {/* Funnel Chart */}
            <Card glow className="p-8 mb-12">
                <h2 className="text-xl font-bold mb-8 uppercase tracking-widest flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500" /> Drop-off Analysis
                </h2>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats} layout="vertical" margin={{ left: 40, right: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                stroke="#52525b"
                                fontSize={10}
                                width={120}
                                tick={{ fontWeight: 'black' }}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                {stats.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === stats.length - 1 ? '#10b981' : '#dc2626'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <div className="flex justify-end">
                <button
                    onClick={fetchStats}
                    className="px-6 py-2 bg-zinc-900 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors"
                >
                    Refresh Data
                </button>
            </div>
        </div>
    );
}
