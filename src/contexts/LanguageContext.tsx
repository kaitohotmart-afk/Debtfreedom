'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type Language = 'en' | 'af' | 'pt';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, options?: string | { defaultValue?: string; returnObjects?: boolean }) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('en');
    const [translations, setTranslations] = useState<Record<string, any>>({});
    const router = useRouter();
    const pathname = usePathname();

    // Load translations when language changes
    useEffect(() => {
        async function loadTranslations() {
            try {
                const response = await fetch(`/locales/${language}/common.json?t=${new Date().getTime()}`);
                if (!response.ok) {
                    console.error(`[LanguageContext] Failed to fetch translations: ${response.status} ${response.statusText}`);
                    return;
                }
                const data = await response.json();
                setTranslations(data);
            } catch (error) {
                console.error('[LanguageContext] Error loading translations:', error);
            }
        }
        loadTranslations();
    }, [language]);

    // Load language from localStorage on mount
    useEffect(() => {
        const storedLang = localStorage.getItem('language') as Language;
        if (storedLang && ['en', 'af', 'pt'].includes(storedLang)) {
            setLanguageState(storedLang);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('language', lang);
    };

    // Translation function - supports nested keys like 'landing.hero.headline'
    const t = (key: string, options?: string | { defaultValue?: string; returnObjects?: boolean }): any => {
        const defaultValue = typeof options === 'string' ? options : options?.defaultValue;
        const returnObjects = typeof options === 'object' ? options?.returnObjects : false;

        const keys = key.split('.');
        let value: any = translations;

        for (const k of keys) {
            value = value?.[k];
            if (value === undefined) return defaultValue || key;
        }

        return value || defaultValue || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
