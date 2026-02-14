"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { quizQuestions } from "@/data/quizQuestions";
import { ChevronRight, Lock } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { usePixel } from "@/hooks/usePixel";

export default function QuizPage() {
    const router = useRouter();
    const { t, language } = useLanguage();
    const { trackEvent } = usePixel();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        trackEvent("quiz_start");
    }, []);

    const currentQuestion = quizQuestions[currentQuestionIndex];
    const totalQuestions = quizQuestions.length;

    useEffect(() => {
        setProgress(((currentQuestionIndex + 1) / totalQuestions) * 100);
    }, [currentQuestionIndex, totalQuestions]);

    const handleAnswer = (value: number) => {
        trackEvent(`quiz_step_${currentQuestionIndex + 1}`, {
            question_id: currentQuestion.id,
            question_key: currentQuestion.key,
            answer_value: value
        });

        if (currentQuestionIndex < totalQuestions - 1) {
            setTimeout(() => {
                setCurrentQuestionIndex((prev) => prev + 1);
            }, 300); // Small delay for user feedback
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = () => {
        setIsAnalyzing(true);
        // Calculate final score
        const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
        const maxScore = quizQuestions.reduce((acc, q) => {
            const maxOption = Math.max(...q.options.map(o => o.value));
            return acc + maxOption;
        }, 0);

        // Normalize to 0-100
        const normalizedScore = Math.round((totalScore / maxScore) * 100);

        // Save strictly to local storage for now (no DB yet)
        localStorage.setItem("quizScore", normalizedScore.toString());

        trackEvent("quiz_complete", {
            score: normalizedScore,
            total_questions: totalQuestions
        });
        trackEvent("lead", { value: 0, currency: "ZAR" });

        // Simulate deep analysis
        setTimeout(() => {
            router.push("/results");
        }, 3000);
    };

    if (isAnalyzing) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <div className="absolute inset-0 gradient-hero opacity-10 animate-pulse-slow" />

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="z-10 bg-black/50 backdrop-blur-xl p-10 rounded-2xl border border-white/10 glow-red"
                >
                    <div className="w-16 h-16 border-4 border-t-danger-red border-white/20 rounded-full animate-spin mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-white mb-2 font-display">
                        {t("quiz.analyzing.title")}
                    </h2>
                    <p className="text-gray-400 animate-pulse">
                        {t("quiz.analyzing.subtitle")}
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-danger-red/10 to-transparent pointer-events-none" />

            {/* Header / Progress */}
            <div className="w-full p-6 z-10 flex flex-col gap-4">
                <div className="flex justify-between items-center text-sm text-gray-400 font-mono">
                    <span>{t("quiz.question")} {currentQuestionIndex + 1}/{totalQuestions}</span>
                    <span className="flex items-center gap-1">
                        <Lock className="w-3 h-3" /> {t("quiz.secure")}
                    </span>
                </div>
                <div className="h-2 w-full bg-gray-900 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-danger-red to-warning-orange"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-6 z-10">
                <div className="max-w-xl w-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestion.id}
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -50, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-8"
                        >
                            {/* Question */}
                            <h1 className="text-3xl md:text-4xl font-bold font-display text-center leading-tight">
                                {t(`quiz.questions.${currentQuestion.key}.question`)}
                            </h1>

                            {/* Options */}
                            <div className="space-y-3">
                                {currentQuestion.options.map((option, index) => (
                                    <motion.button
                                        key={option.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => handleAnswer(option.value)}
                                        className={cn(
                                            "w-full p-5 text-left rounded-xl transition-all duration-300 group relative overflow-hidden",
                                            "bg-white/5 border border-white/10 hover:border-danger-red/50",
                                            "hover:bg-white/10 hover:shadow-[0_0_30px_rgba(220,38,38,0.2)]"
                                        )}
                                    >
                                        <div className="flex items-center justify-between relative z-10">
                                            <span className="text-lg md:text-xl font-medium text-gray-200 group-hover:text-white transition-colors">
                                                {t(`quiz.questions.${currentQuestion.key}.options.${option.id}`)}
                                            </span>
                                            <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-danger-red transition-colors opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1" />
                                        </div>

                                        {/* Hover Gradient Background */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-danger-red/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Footer Trust */}
            <div className="p-6 text-center text-xs text-gray-600 font-mono z-10">
                Debt Freedom Reset™ &copy; {new Date().getFullYear()}
            </div>
        </div>
    );
}
