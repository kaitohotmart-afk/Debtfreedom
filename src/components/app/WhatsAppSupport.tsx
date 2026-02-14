'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Shield, ArrowRight, UserPlus } from 'lucide-react';

export default function WhatsAppSupport() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 flex flex-col justify-center"
            >
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                    <MessageCircle className="w-8 h-8 text-green-500" />
                </div>

                <h2 className="text-3xl font-bold text-white mb-4">Join the WhatsApp Community</h2>
                <p className="text-zinc-300 mb-8 max-w-md">
                    Connect with others on the same journey. Share wins, ask questions (anonymously if preferred), and get daily motivation.
                </p>

                <ul className="space-y-4 mb-8">
                    <li className="flex items-center gap-3 text-zinc-300">
                        <Shield className="w-5 h-5 text-green-500" />
                        <span>Admin-moderated for safety</span>
                    </li>
                    <li className="flex items-center gap-3 text-zinc-300">
                        <UserPlus className="w-5 h-5 text-green-500" />
                        <span>Over 2,400 members</span>
                    </li>
                </ul>

                <button
                    className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 w-fit transition-all shadow-lg shadow-green-500/20"
                >
                    <MessageCircle className="w-6 h-6" />
                    Join Group Chat
                    <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-zinc-500 text-xs mt-4">
                    By joining, you agree to our community guidelines. Your phone number will be visible to other members.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 relative overflow-hidden"
            >
                {/* Chat Preview Mockup */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500" />

                <h3 className="text-white font-semibold mb-6">Live Community Activity</h3>

                <div className="space-y-4">
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs font-bold">JD</div>
                        <div className="bg-zinc-900 rounded-2xl rounded-tl-none p-3 max-w-[80%]">
                            <p className="text-zinc-300 text-sm">Just paid off my Edgars account! R4,500 gone forever! 🎉</p>
                            <span className="text-zinc-600 text-[10px] block mt-1">10:42 AM</span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">SM</div>
                        <div className="bg-zinc-900 rounded-2xl rounded-tl-none p-3 max-w-[80%]">
                            <p className="text-zinc-300 text-sm">Congrats! I'm attacking my Capitec loan next. Using the avalanche method.</p>
                            <span className="text-zinc-600 text-[10px] block mt-1">10:45 AM</span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 text-xs font-bold">NK</div>
                        <div className="bg-zinc-900 rounded-2xl rounded-tl-none p-3 max-w-[80%]">
                            <p className="text-zinc-300 text-sm">Anyone know if I can negotiate interest rates with Woolworths? 🤔</p>
                            <span className="text-zinc-600 text-[10px] block mt-1">10:51 AM</span>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />
            </motion.div>
        </div>
    );
}
