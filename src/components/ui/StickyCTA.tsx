"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";
import { useState, useEffect } from "react";

export default function StickyCTA() {
    const { t } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling down 600px (past hero)
            if (window.scrollY > 600) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToPricing = () => {
        const pricingSection = document.getElementById("pricing");
        if (pricingSection) {
            pricingSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    exit={{ y: 100 }}
                    className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/90 backdrop-blur-md border-t border-white/10 md:hidden"
                >
                    <div className="flex items-center justify-between gap-4">
                        <div className="text-white">
                            <div className="text-xs text-gray-400 line-through">{t("sales.pricing.original")}</div>
                            <div className="font-bold text-xl leading-none text-danger-red">
                                {t("sales.pricing.price")}
                            </div>
                        </div>
                        <button
                            onClick={scrollToPricing}
                            className="flex-1 bg-white text-black font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
                        >
                            {t("sales.hero.cta")} <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
