'use client';

import { motion } from 'framer-motion';
import { Quote, Trophy, Calendar, Briefcase, Heart, CreditCard } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SuccessStories() {
    const { t } = useLanguage();

    const stories = [
        {
            id: 1,
            name: "Thabo M.",
            debt_paid: "R180,000",
            timeframe: "24 months",
            category: "credit_card",
            lesson: "I stopped trying to keep up appearances. Being honest with my friends changed everything.",
            quote: "My friends respect me more now that I'm honest about my struggles.",
            icon: CreditCard,
            color: "blue"
        },
        {
            id: 2,
            name: "Sarah J.",
            debt_paid: "R50,000",
            timeframe: "14 months",
            category: "medical",
            lesson: "Negotiated payment plans with the hospital. They were willing to help.",
            quote: "Don't be afraid to ask for help. Most creditors want to be paid, even if it's slowly.",
            icon: Heart,
            color: "red"
        },
        {
            id: 3,
            name: "Mpho K.",
            debt_paid: "R320,000",
            timeframe: "3 years",
            category: "job_loss",
            lesson: "Sold my fancy car and bought a reliable older one. It hurt my ego but saved my life.",
            quote: "My ego kept me broke. Humility set me free.",
            icon: Briefcase,
            color: "green"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-full bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-2xl p-8 text-center mb-8"
            >
                <h2 className="text-3xl font-bold text-white mb-4">Real Stories, Real Freedom</h2>
                <p className="text-zinc-300 max-w-2xl mx-auto">
                    See how others have conquered their debt mountain. Use these stories as fuel for your own journey.
                </p>
            </motion.div>

            {stories.map((story, index) => (
                <motion.div
                    key={story.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all group"
                >
                    <div className={`w-12 h-12 rounded-xl bg-${story.color}-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                        <story.icon className={`w-6 h-6 text-${story.color}-500`} />
                    </div>

                    <div className="mb-6 relative">
                        <Quote className="absolute -top-2 -left-2 w-8 h-8 text-zinc-800 fill-zinc-800" />
                        <p className="text-zinc-300 italic relative z-10 pl-6">"{story.quote}"</p>
                    </div>

                    <div className="space-y-4 mb-6">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-zinc-500">Debt Paid</span>
                            <span className="text-emerald-400 font-bold">{story.debt_paid}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-zinc-500">Timeframe</span>
                            <span className="text-white font-medium">{story.timeframe}</span>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-zinc-800">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-500">
                                {story.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-white font-semibold">{story.name}</p>
                                <p className="text-zinc-500 text-xs uppercase tracking-wider">Debt Free</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
