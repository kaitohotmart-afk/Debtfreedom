'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, Info, CheckCircle2, AlertTriangle, XCircle, Sparkles, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Notification, getNotifications, markAsRead, markAllAsRead } from '@/lib/notifications';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { enUS, ptBR } from 'date-fns/locale';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export default function NotificationBell() {
    const { user } = useAuth();
    const { language } = useLanguage();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fnsLocale = language === 'pt' ? ptBR : enUS;

    useEffect(() => {
        if (user) {
            fetchNotifications();

            // Setup Realtime
            const supabase = getSupabaseBrowserClient();
            const channel = supabase
                .channel(`notifications:${user.id}`)
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'notifications',
                        filter: `user_id=eq.${user.id}`
                    },
                    (payload: { new: Notification }) => {
                        const newNotification = payload.new as Notification;
                        setNotifications(prev => [newNotification, ...prev].slice(0, 20));
                        setUnreadCount(prev => prev + 1);

                        // Opcional: Tocar som ou mostrar toast narrativo
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [user]);

    useEffect(() => {
        // Fechar ao clicar fora
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        if (!user) return;
        const data = await getNotifications(user.id);
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.read).length);
    };

    const handleMarkAsRead = async (id: string) => {
        await markAsRead(id);
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const handleMarkAllAsRead = async () => {
        if (!user) return;
        await markAllAsRead(user.id);
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
            case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
            case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
            case 'motivation': return <Sparkles className="w-4 h-4 text-blue-500" />;
            case 'reminder': return <Clock className="w-4 h-4 text-zinc-400" />;
            default: return <Info className="w-4 h-4 text-zinc-400" />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-xl hover:bg-white/5 transition-colors group"
            >
                <Bell className={`w-5 h-5 transition-colors ${unreadCount > 0 ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-black">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute bottom-full left-0 mb-4 w-80 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[100]"
                    >
                        <div className="p-4 border-b border-white/5 flex items-center justify-between">
                            <h3 className="text-sm font-bold">{language === 'pt' ? 'Notificações' : 'Notifications'}</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="text-[10px] text-zinc-500 hover:text-white uppercase tracking-widest transition-colors"
                                >
                                    {language === 'pt' ? 'Marcar todas como lidas' : 'Mark all as read'}
                                </button>
                            )}
                        </div>

                        <div className="max-h-96 overflow-y-auto custom-scrollbar">
                            {notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                                        className={`p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer relative ${!notification.read ? 'bg-white/[0.03]' : ''}`}
                                    >
                                        <div className="flex gap-3">
                                            <div className="mt-1 shrink-0">
                                                {getIcon(notification.type)}
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className={`text-xs font-bold ${!notification.read ? 'text-white' : 'text-zinc-400'}`}>
                                                        {notification.title}
                                                    </p>
                                                    <span className="text-[10px] text-zinc-600 whitespace-nowrap">
                                                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: fnsLocale })}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-zinc-500 leading-relaxed">
                                                    {notification.message}
                                                </p>
                                                {notification.link && (
                                                    <Link
                                                        href={notification.link}
                                                        className="text-[10px] text-emerald-500 hover:underline inline-block mt-1"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        {language === 'pt' ? 'Ver detalhes' : 'View details'}
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center space-y-2">
                                    <Bell className="w-8 h-8 text-zinc-800 mx-auto" />
                                    <p className="text-xs text-zinc-500">
                                        {language === 'pt' ? 'Nenhuma notificação por enquanto.' : 'No notifications yet.'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
