'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle2, XCircle, ArrowRight, Sparkles, TrendingDown, AlertTriangle } from 'lucide-react';

export default function LandingPage() {
    const router = useRouter();
    const { language, setLanguage, t } = useLanguage();
    const [showExitIntent, setShowExitIntent] = useState(false);
    const { scrollYProgress } = useScroll();
    const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);
    const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

    // Exit intent detection
    useEffect(() => {
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0 && !localStorage.getItem('exit_intent_shown')) {
                setShowExitIntent(true);
                localStorage.setItem('exit_intent_shown', 'true');
            }
        };

        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, []);

    const handleQuizClick = () => {
        router.push('/quiz');
    };

    const changeLanguage = (lang: 'en' | 'af' | 'pt') => {
        setLanguage(lang);
    };

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-black to-orange-950/20" />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute top-0 left-0 w-full h-full"
                >
                    <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[120px]" />
                    <div className="absolute bottom-20 right-10 w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[140px]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[100px]" />
                </motion.div>
            </div>

            {/* Language Selector - Premium Design */}
            <motion.div
                style={{ opacity: headerOpacity }}
                className="fixed top-6 right-6 z-50 flex gap-3 glass-premium rounded-full px-5 py-3"
            >
                {['en', 'af', 'pt'].map((lang) => (
                    <button
                        key={lang}
                        onClick={() => changeLanguage(lang as 'en' | 'af' | 'pt')}
                        className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${language === lang
                                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-500/50'
                                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        {lang.toUpperCase()}
                    </button>
                ))}
            </motion.div>

            {/* Hero Section - Ultra Premium */}
            <section className="relative min-h-screen flex items-center justify-center px-6">
                <motion.div
                    style={{ scale: heroScale }}
                    className="relative z-10 max-w-6xl mx-auto text-center py-20"
                >
                    {/* Badge/Tag */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-full px-6 py-3 mb-8"
                    >
                        <Sparkles className="w-5 h-5 text-orange-400" />
                        <span className="text-sm font-semibold text-white/90">
                            The 90-Day Financial Freedom System
                        </span>
                    </motion.div>

                    {/* Main Headline - Massive and Bold */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-6xl md:text-8xl font-black font-poppins mb-8 leading-[1.1] tracking-tight"
                    >
                        <span className="block bg-gradient-to-r from-white via-red-100 to-white bg-clip-text text-transparent">
                            {t('landing.hero.headline')}
                        </span>
                    </motion.h1>

                    {/* Subheadline - High Contrast */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-xl md:text-3xl text-red-100 mb-16 max-w-4xl mx-auto leading-relaxed font-medium"
                    >
                        {t('landing.hero.subheadline')}
                    </motion.p>

                    {/* Mega CTA Button - Impossible to Miss */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="flex flex-col items-center gap-6"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleQuizClick}
                            className="group relative overflow-hidden bg-gradient-to-r from-red-600 via-red-500 to-orange-600 px-16 py-8 rounded-2xl text-2xl md:text-3xl font-black shadow-2xl glow-red transition-all"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-400 opacity-0 group-hover:opacity-30 transition-opacity shimmer" />
                            <div className="relative flex items-center gap-4">
                                <span className="text-white">🔥 {t('landing.hero.cta')}</span>
                                <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                            </div>
                        </motion.button>

                        {/* Trust Indicators - Modernized */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/60"
                        >
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                                <span>No credit card</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                                <span>2-minute assessment</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                                <span>100% confidential</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Floating Statistics - Social Proof */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
                    >
                        {[
                            { number: '2,847', label: 'People assessed this week' },
                            { number: '87%', label: 'Found hope in results' },
                            { number: 'R249', label: 'One-time investment' },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2 + i * 0.1 }}
                                className="glass-premium rounded-2xl p-6 border border-white/10 hover:border-red-500/50 transition-all"
                            >
                                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-sm text-white/70">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Scroll Indicator - Animated */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-8 h-14 border-2 border-white/20 rounded-full flex justify-center p-2"
                    >
                        <div className="w-2 h-2 bg-red-400 rounded-full" />
                    </motion.div>
                </motion.div>
            </section>

            {/* Pain Points Section - Dramatic Redesign */}
            <section className="relative py-32 bg-gradient-to-b from-black via-red-950/10 to-black">
                <div className="max-w-5xl mx-auto px-6">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <div className="inline-flex items-center gap-3 bg-red-600/10 border border-red-500/30 rounded-full px-6 py-3 mb-6">
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                            <span className="text-sm font-semibold text-red-300">
                                This Hits Too Close to Home
                            </span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black font-poppins mb-6">
                            <span className="bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">
                                {t('landing.painPoints.title')}
                            </span>
                        </h2>
                    </motion.div>

                    {/* Pain Points Grid - Premium Cards */}
                    <div className="grid grid-cols-1 gap-4">
                        {['points.0', 'points.1', 'points.2', 'points.3', 'points.4', 'points.5', 'points.6'].map((key, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.08, duration: 0.5 }}
                                whileHover={{ x: 8, scale: 1.02 }}
                                className="group relative overflow-hidden glass-premium p-8 rounded-2xl border border-red-500/20 hover:border-red-500/50 transition-all cursor-pointer"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative flex items-start gap-6">
                                    <div className="flex-shrink-0 w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <XCircle className="w-6 h-6 text-red-400" />
                                    </div>
                                    <p className="text-lg md:text-xl text-white/90 group-hover:text-white transition-colors leading-relaxed">
                                        {t(`landing.painPoints.${key}`)}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Section - Maximum Impact */}
            <section className="relative py-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-red-950/20 to-black" />

                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-12"
                    >
                        <div className="inline-flex items-center gap-3 bg-orange-600/10 border border-orange-500/30 rounded-full px-6 py-3">
                            <TrendingDown className="w-5 h-5 text-orange-400" />
                            <span className="text-sm font-semibold text-orange-300">
                                Your Financial Turning Point Starts Here
                            </span>
                        </div>

                        <h2 className="text-5xl md:text-7xl font-black font-poppins leading-tight">
                            <span className="block bg-gradient-to-r from-white via-orange-200 to-white bg-clip-text text-transparent mb-4">
                                {t('landing.cta.main')}
                            </span>
                        </h2>

                        <p className="text-2xl md:text-3xl text-white/80 max-w-3xl mx-auto font-medium">
                            {t('landing.cta.subtitle')}
                        </p>

                        <motion.button
                            whileHover={{ scale: 1.05, y: -8 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleQuizClick}
                            className="group relative overflow-hidden bg-gradient-to-r from-orange-600 via-red-600 to-red-700 px-20 py-10 rounded-2xl text-3xl md:text-4xl font-black shadow-2xl glow-red transition-all mt-8"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 opacity-0 group-hover:opacity-40 transition-opacity shimmer" />
                            <div className="relative flex items-center gap-4">
                                <Sparkles className="w-10 h-10" />
                                <span className="text-white">{t('landing.cta.quiz')}</span>
                                <ArrowRight className="w-10 h-10 group-hover:translate-x-3 transition-transform" />
                            </div>
                        </motion.button>

                        <div className="flex flex-wrap items-center justify-center gap-8 text-white/50 text-sm pt-6">
                            <span>⚡ Takes less than 2 minutes</span>
                            <span>🔒 100% Free & Private</span>
                            <span>✨ Instant results</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Exit Intent Modal - Premium Design */}
            {showExitIntent && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-6"
                    onClick={() => setShowExitIntent(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 30 }}
                        animate={{ scale: 1, y: 0 }}
                        className="relative max-w-2xl w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-orange-600 rounded-3xl blur-xl opacity-50" />
                        <div className="relative bg-gradient-to-br from-red-700 to-red-900 p-12 rounded-3xl border border-red-500/50 text-center space-y-8">
                            <div className="text-6xl mb-4">⚠️</div>
                            <h3 className="text-4xl md:text-5xl font-black text-white leading-tight">
                                Wait! Are You SURE You Want to Leave?
                            </h3>
                            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
                                You're literally <span className="font-bold text-orange-300">2 minutes away</span> from discovering if there's still hope for your financial future...
                            </p>
                            <div className="space-y-4">
                                <button
                                    onClick={() => {
                                        setShowExitIntent(false);
                                        handleQuizClick();
                                    }}
                                    className="w-full bg-white hover:bg-orange-50 text-red-700 px-12 py-6 rounded-xl font-black text-xl hover:scale-105 transition-all shadow-2xl"
                                >
                                    ✓ OK, I'LL TAKE THE 2-MINUTE ASSESSMENT
                                </button>
                                <button
                                    onClick={() => setShowExitIntent(false)}
                                    className="text-white/50 hover:text-white text-sm transition-colors"
                                >
                                    No thanks, I prefer to stay stuck
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
