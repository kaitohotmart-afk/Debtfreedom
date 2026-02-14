"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";

// South African names for authenticity
const BUYERS = [
    { name: "Thabo M.", location: "JHB" },
    { name: "Sipho K.", location: "DBN" },
    { name: "Jenny V.", location: "CPT" },
    { name: "Lerato N.", location: "PTA" },
    { name: "Michael S.", location: "JHB" },
    { name: "Nandi Z.", location: "DBN" },
    { name: "Johan B.", location: "BFN" },
    { name: "Precious D.", location: "EL" }
];

export default function RecentPurchasePopup() {
    const { t } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);
    const [currentBuyer, setCurrentBuyer] = useState(BUYERS[0]);
    const [timeAgo, setTimeAgo] = useState(2);

    useEffect(() => {
        // Initial delay
        const initialTimeout = setTimeout(() => {
            setIsVisible(true);
        }, 5000);

        // Cycle notifications
        const cycleInterval = setInterval(() => {
            setIsVisible(false);

            setTimeout(() => {
                const randomBuyer = BUYERS[Math.floor(Math.random() * BUYERS.length)];
                const randomTime = Math.floor(Math.random() * 10) + 1; // 1-10 mins ago
                setCurrentBuyer(randomBuyer);
                setTimeAgo(randomTime);
                setIsVisible(true);
            }, 2000); // Wait 2s before showing next

        }, 20000); // Every 20 seconds

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(cycleInterval);
        };
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    className="fixed bottom-4 left-4 z-50 md:bottom-8 md:left-8 w-max max-w-[90vw]"
                >
                    <div className="flex items-center gap-4 bg-white text-black p-4 rounded-xl shadow-2xl border border-gray-100">
                        <div className="relative">
                            <div className="w-12 h-12 bg-success-green/10 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-success-green" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-success-green text-white text-[10px] px-1.5 py-0.5 rounded-full border border-white">
                                <ShoppingCart className="w-3 h-3" />
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-bold leading-tight">
                                {currentBuyer.name} <span className="text-gray-400 font-normal">from {currentBuyer.location}</span>
                            </p>
                            <p className="text-xs text-gray-500">
                                {t("sales.notifications.purchased")} • <span className="text-success-green font-medium">{timeAgo} {t("sales.notifications.minutes_ago")}</span>
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
