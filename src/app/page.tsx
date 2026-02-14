'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [showSelector, setShowSelector] = useState(false);

  // Check if user has already selected language
  useEffect(() => {
    const hasSelectedLanguage = localStorage.getItem('language');
    if (!hasSelectedLanguage) {
      setShowSelector(true);
    } else {
      // User has already selected language, go to landing
      router.push('/landing');
    }
  }, [router]);

  const handleLanguageSelect = (lang: 'en' | 'af' | 'pt') => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    router.push('/landing');
  };

  if (!showSelector) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--deep-black))]">
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-2xl mx-auto px-6 text-center"
      >
        {/* Globe icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="flex justify-center mb-8"
        >
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center">
            <Globe className="w-10 h-10 text-white" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-bold text-white mb-4 font-poppins"
        >
          {t('landing.languageSelector.title')}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-white/80 mb-12"
        >
          {t('landing.languageSelector.subtitle')}
        </motion.p>

        {/* Language buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-4"
        >
          <button
            onClick={() => handleLanguageSelect('en')}
            className="group relative overflow-hidden bg-white text-gray-900 py-5 px-8 rounded-xl font-semibold text-lg transition-all hover:shadow-2xl hover:scale-105"
          >
            <span className="relative z-10">🇬🇧 English (Default)</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
          </button>

          <button
            onClick={() => handleLanguageSelect('af')}
            className="group relative overflow-hidden bg-white/90 text-gray-900 py-5 px-8 rounded-xl font-semibold text-lg transition-all hover:bg-white hover:shadow-2xl hover:scale-105"
          >
            <span className="relative z-10">🇿🇦 Afrikaans</span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
          </button>

          <button
            onClick={() => handleLanguageSelect('pt')}
            className="group relative overflow-hidden bg-white/90 text-gray-900 py-5 px-8 rounded-xl font-semibold text-lg transition-all hover:bg-white hover:shadow-2xl hover:scale-105"
          >
            <span className="relative z-10">🇵🇹 Português</span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
