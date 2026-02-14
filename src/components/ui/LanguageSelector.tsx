'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, X } from 'lucide-react';

export default function LanguageSelector() {
    const { language, setLanguage, t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const handleLanguageSelect = (lang: 'en' | 'af' | 'pt') => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
        setIsOpen(false);
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-white hover:bg-white/5 w-full rounded-xl transition-colors mb-2"
            >
                <Globe className="w-5 h-5" />
                <span>{t('landing.languageSelector.title', 'Change Language')}</span>
            </button>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />

                        {/* Content */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 text-zinc-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Globe className="w-8 h-8 text-emerald-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    {t('landing.languageSelector.title', 'Choose Language')}
                                </h2>
                                <p className="text-zinc-400">
                                    {t('landing.languageSelector.subtitle', 'Select your preferred language')}
                                </p>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={() => handleLanguageSelect('en')}
                                    className={`w-full relative overflow-hidden py-4 px-6 rounded-xl font-semibold text-lg transition-all flex items-center justify-between group ${language === 'en'
                                        ? 'bg-white text-black'
                                        : 'bg-zinc-800 text-white hover:bg-zinc-700'
                                        }`}
                                >
                                    <span className="relative z-10 flex items-center gap-3">
                                        <span className="text-2xl">🇬🇧</span>
                                        English
                                    </span>
                                    {language === 'en' && (
                                        <motion.div
                                            layoutId="active-lang"
                                            className="w-2 h-2 bg-emerald-500 rounded-full"
                                        />
                                    )}
                                </button>

                                <button
                                    onClick={() => handleLanguageSelect('af')}
                                    className={`w-full relative overflow-hidden py-4 px-6 rounded-xl font-semibold text-lg transition-all flex items-center justify-between group ${language === 'af'
                                        ? 'bg-white text-black'
                                        : 'bg-zinc-800 text-white hover:bg-zinc-700'
                                        }`}
                                >
                                    <span className="relative z-10 flex items-center gap-3">
                                        <span className="text-2xl">🇿🇦</span>
                                        Afrikaans
                                    </span>
                                    {language === 'af' && (
                                        <motion.div
                                            layoutId="active-lang"
                                            className="w-2 h-2 bg-emerald-500 rounded-full"
                                        />
                                    )}
                                </button>

                                <button
                                    onClick={() => handleLanguageSelect('pt')}
                                    className={`w-full relative overflow-hidden py-4 px-6 rounded-xl font-semibold text-lg transition-all flex items-center justify-between group ${language === 'pt'
                                        ? 'bg-white text-black'
                                        : 'bg-zinc-800 text-white hover:bg-zinc-700'
                                        }`}
                                >
                                    <span className="relative z-10 flex items-center gap-3">
                                        <span className="text-2xl">🇵🇹</span>
                                        Português
                                    </span>
                                    {language === 'pt' && (
                                        <motion.div
                                            layoutId="active-lang"
                                            className="w-2 h-2 bg-emerald-500 rounded-full"
                                        />
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
