"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface ResultsGaugeProps {
    score: number;
}

export function ResultsGauge({ score }: ResultsGaugeProps) {
    // Determine color based on score (Lower score = Better in some systems, but here 0 = bad, 100 = good? 
    // Wait, in previous logic: 
    // R10k debt = 10 pts (good), >200k = 1 pt (bad).
    // So High Score = Good Financial Health. Low Score = Critical.

    // Let's invert visualization for dramatic effect if needed, but standard logic:
    // 0-40: Critical (Red)
    // 41-70: Warning (Orange)
    // 71-100: Safe (Green)

    const getColor = (s: number) => {
        if (s <= 40) return "text-danger-red";
        if (s <= 70) return "text-warning-orange";
        return "text-success-green";
    };

    const getLabel = (s: number) => {
        if (s <= 40) return "CRITICAL";
        if (s <= 70) return "WARNING";
        return "STABLE";
    };

    const colorClass = getColor(score);
    const label = getLabel(score);

    // Calculate circumference for SVG circle
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="relative flex flex-col items-center justify-center">
            {/* Glow Effect */}
            <div className={cn("absolute inset-0 blur-3xl opacity-20",
                score <= 40 ? "bg-danger-red" : score <= 70 ? "bg-warning-orange" : "bg-success-green"
            )} />

            <div className="relative w-64 h-64">
                {/* Background Circle */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="128"
                        cy="128"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        className="text-gray-800"
                    />
                    {/* Progress Circle */}
                    <motion.circle
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                        cx="128"
                        cy="128"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeLinecap="round"
                        className={cn(colorClass, "drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]")}
                    />
                </svg>

                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                        className={cn("text-5xl font-bold font-mono", colorClass)}
                    >
                        {score}
                    </motion.span>
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="text-white/60 text-sm uppercase tracking-widest mt-2"
                    >
                        / 100
                    </motion.span>
                </div>
            </div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2 }}
                className={cn("mt-4 px-6 py-2 rounded-full border bg-black/50 backdrop-blur-md uppercase font-bold tracking-widest",
                    score <= 40 ? "border-danger-red text-danger-red shadow-[0_0_20px_rgba(220,38,38,0.4)]" :
                        score <= 70 ? "border-warning-orange text-warning-orange" : "border-success-green text-success-green"
                )}
            >
                {label}
            </motion.div>
        </div>
    );
}
