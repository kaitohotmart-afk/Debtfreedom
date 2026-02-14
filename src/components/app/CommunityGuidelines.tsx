'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';

export default function CommunityGuidelines() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <ShieldCheck className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-2">Community Guidelines</h2>
                <p className="text-zinc-400">
                    To keep this space safe and supportive for everyone, we ask all members to follow these simple rules.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-emerald-900/10 border border-emerald-500/20 rounded-2xl p-6"
                >
                    <h3 className="text-emerald-400 font-bold mb-6 flex items-center gap-2">
                        <CheckCircle2 className="w-6 h-6" />
                        Do's (Encouraged)
                    </h3>
                    <ul className="space-y-4">
                        <li className="flex gap-3">
                            <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm flex-shrink-0">1</span>
                            <p className="text-zinc-300 text-sm">Share your wins, no matter how small. Every step counts.</p>
                        </li>
                        <li className="flex gap-3">
                            <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm flex-shrink-0">2</span>
                            <p className="text-zinc-300 text-sm">Ask questions when you're stuck or confused.</p>
                        </li>
                        <li className="flex gap-3">
                            <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm flex-shrink-0">3</span>
                            <p className="text-zinc-300 text-sm">Offer encouragement to others who are struggling.</p>
                        </li>
                        <li className="flex gap-3">
                            <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm flex-shrink-0">4</span>
                            <p className="text-zinc-300 text-sm">Share resources or tips that worked for you personally.</p>
                        </li>
                    </ul>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-red-900/10 border border-red-500/20 rounded-2xl p-6"
                >
                    <h3 className="text-red-400 font-bold mb-6 flex items-center gap-2">
                        <XCircle className="w-6 h-6" />
                        Dont's (Prohibited)
                    </h3>
                    <ul className="space-y-4">
                        <li className="flex gap-3">
                            <span className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-sm flex-shrink-0">1</span>
                            <p className="text-zinc-300 text-sm">No selling, promotion, or MLM schemes.</p>
                        </li>
                        <li className="flex gap-3">
                            <span className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-sm flex-shrink-0">2</span>
                            <p className="text-zinc-300 text-sm">No judgment, shaming, or negative criticism.</p>
                        </li>
                        <li className="flex gap-3">
                            <span className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-sm flex-shrink-0">3</span>
                            <p className="text-zinc-300 text-sm">No asking for money or loans from other members.</p>
                        </li>
                        <li className="flex gap-3">
                            <span className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-sm flex-shrink-0">4</span>
                            <p className="text-zinc-300 text-sm">No professional financial advice (unless registered).</p>
                        </li>
                    </ul>
                </motion.div>
            </div>
        </div>
    );
}
