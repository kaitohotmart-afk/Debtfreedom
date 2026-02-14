"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { LogOut, LayoutDashboard, Wallet, TrendingDown, Target, Menu, X, Map, Receipt, AlertTriangle, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LanguageSelector from "@/components/ui/LanguageSelector";
import NotificationBell from "@/components/notifications/NotificationBell";

export default function Sidebar() {
    const { t } = useLanguage();
    const { signOut } = useAuth();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { id: "dashboard", href: "/app/dashboard", icon: LayoutDashboard, label: t("common.nav.dashboard") },
        { id: "x-ray", href: "/app/x-ray", icon: Wallet, label: t("common.nav.x_ray") },
        { id: "debt", href: "/app/debt", icon: TrendingDown, label: t("common.nav.debt") },
        { id: "budget", href: "/app/budget", icon: Target, label: t("common.nav.budget") },
        { id: "journey", href: "/app/journey", icon: Map, label: t("common.nav.journey") },
        { id: "expenses", href: "/app/expenses", icon: Receipt, label: t("common.nav.expenses") },
        { id: "SOS", href: "/app/sos", icon: AlertTriangle, label: t("common.nav.sos"), highlight: true },
        { id: "community", href: "/app/community", icon: Users, label: t("common.nav.community") },
    ];

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden fixed top-6 left-6 z-50 p-2 bg-zinc-900 border border-white/10 rounded-lg"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:static inset-y-0 left-0 w-64 bg-black border-r border-white/5 p-6 z-40 transition-transform duration-300 md:translate-x-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                flex flex-col h-full
            `}>
                <div className="flex items-center justify-between mb-12">
                    <div className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                        Debt Freedom Reset™
                    </div>
                    <NotificationBell />
                </div>

                <nav className="space-y-2 flex-grow">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? "bg-emerald-500/10 text-emerald-400 font-medium"
                                    : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto pt-12">
                    <LanguageSelector />
                    <button
                        onClick={() => signOut()}
                        className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/5 w-full rounded-xl transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
