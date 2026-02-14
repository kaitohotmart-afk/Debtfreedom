"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function ExitIntentPopup() {
    const { t } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);
    const [hasTriggered, setHasTriggered] = useState(false);

    useEffect(() => {
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0 && !hasTriggered) {
                setIsVisible(true);
                setHasTriggered(true);
            }
        };

        const handleBlur = () => {
            if (!hasTriggered && window.innerWidth < 768) {
                // Simple mobile simulation (tab switching)
                setIsVisible(true);
                setHasTriggered(true);
            }
        };

        document.addEventListener("mouseleave", handleMouseLeave);
        window.addEventListener("blur", handleBlur);

        return () => {
            document.removeEventListener("mouseleave", handleMouseLeave);
            window.removeEventListener("blur", handleBlur);
        };
    }, [hasTriggered]);

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-zinc-900 border border-white/10 p-8 rounded-3xl max-w-lg w-full relative overflow-hidden shadow-2xl"
                >
                    <button
                        onClick={() => setIsVisible(false)}
                        className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>

                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-danger-red to-orange-500" />

                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-danger-red/10 rounded-full mb-4">
                            <Gift className="w-8 h-8 text-danger-red" />
                        </div>
                        <h3 className="text-3xl font-display font-bold text-white mb-2">
                            WAIT! Don't Leave Empty Handle
                        </h3>
                        <p className="text-gray-400">
                            Get the first chapter of the <b>Debt Freedom Protocol</b> completely FREE.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="w-full bg-black border border-white/20 rounded-xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-danger-red transition-colors"
                        />
                        <button className="w-full py-4 bg-danger-red hover:bg-red-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95">
                            SEND ME THE FREE CHAPTER <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>

                    <p className="text-center text-xs text-gray-500 mt-6 cursor-pointer hover:text-white transition-colors" onClick={() => setIsVisible(false)}>
                        No thanks, I prefer to stay in debt.
                    </p>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
