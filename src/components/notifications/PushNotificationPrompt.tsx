'use client';

import { useState, useEffect } from 'react';
import { BellRing, ShieldCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { savePushSubscription } from '@/lib/notifications';

export default function PushNotificationPrompt() {
    const { user } = useAuth();
    const { t, language } = useLanguage();
    const [showPrompt, setShowPrompt] = useState(false);
    const [status, setStatus] = useState<'prompt' | 'success' | 'denied'>('prompt');

    useEffect(() => {
        const checkPermission = async () => {
            if (!('Notification' in window)) return;

            const permission = Notification.permission;
            const dismissed = localStorage.getItem('push_prompt_dismissed');

            if (permission === 'default' && !dismissed) {
                // Wait 5 seconds before showing the prompt on dashboard
                setTimeout(() => setShowPrompt(true), 5000);
            }
        };

        checkPermission();
    }, []);

    const requestPermission = async () => {
        if (!('Notification' in window)) return;

        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                setStatus('success');

                // In a real implementation with VAPID keys:
                // const registration = await navigator.serviceWorker.ready;
                // const subscription = await registration.pushManager.subscribe({ ... });
                // await savePushSubscription(user!.id, subscription);

                // Simulated for now
                setTimeout(() => setShowPrompt(false), 3000);
            } else {
                setStatus('denied');
                setTimeout(() => setShowPrompt(false), 3000);
            }
        } catch (error) {
            console.error('Error requesting push permission:', error);
        }
    };

    const dismissPrompt = () => {
        localStorage.setItem('push_prompt_dismissed', 'true');
        setShowPrompt(false);
    };

    return (
        <AnimatePresence>
            {showPrompt && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.9 }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md bg-zinc-900 border border-emerald-500/20 rounded-3xl p-6 shadow-2xl shadow-emerald-500/10 z-[200] backdrop-blur-xl"
                >
                    <button
                        onClick={dismissPrompt}
                        className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/5 transition-colors"
                    >
                        <X className="w-4 h-4 text-zinc-500" />
                    </button>

                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center shrink-0">
                            {status === 'success' ? (
                                <ShieldCheck className="w-6 h-6 text-emerald-500" />
                            ) : (
                                <BellRing className="w-6 h-6 text-emerald-500" />
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-white font-bold text-lg mb-1">
                                {status === 'prompt' && (language === 'pt' ? 'Ativar Notificações?' : 'Enable Notifications?')}
                                {status === 'success' && (language === 'pt' ? 'Tudo Pronto!' : 'All Set!')}
                                {status === 'denied' && (language === 'pt' ? 'Entendido' : 'Understood')}
                            </h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                {status === 'prompt' && (language === 'pt'
                                    ? 'Receba motivação diária, alertas de orçamento e dicas sniper diretamente no seu celular.'
                                    : 'Get daily motivation, budget alerts, and sniper tips directly on your device.')}
                                {status === 'success' && (language === 'pt'
                                    ? 'Você agora receberá as atualizações sniper em tempo real.'
                                    : 'You will now receive sniper updates in real-time.')}
                                {status === 'denied' && (language === 'pt'
                                    ? 'Não enviaremos notificações push, mas você ainda as verá no app.'
                                    : 'We won\'t send push notifications, but you\'ll still see them in-app.')}
                            </p>

                            {status === 'prompt' && (
                                <div className="mt-6 flex gap-3">
                                    <button
                                        onClick={requestPermission}
                                        className="flex-1 bg-emerald-500 text-black py-2.5 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-emerald-400 transition-colors"
                                    >
                                        {language === 'pt' ? 'Sim, Ativar' : 'Yes, Enable'}
                                    </button>
                                    <button
                                        onClick={dismissPrompt}
                                        className="flex-1 bg-zinc-800 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-zinc-700 transition-colors"
                                    >
                                        {language === 'pt' ? 'Depois' : 'Later'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
