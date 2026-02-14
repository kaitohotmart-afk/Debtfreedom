'use client';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'success' | 'warning' | 'danger' | 'info' | 'ghost';
    className?: string;
}

export default function Badge({
    children,
    variant = 'info',
    className,
}: BadgeProps) {
    const variants = {
        success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        warning: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
        danger: 'bg-red-500/10 text-red-400 border-red-500/20',
        info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        ghost: 'bg-white/5 text-zinc-400 border-white/10',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border',
                variants[variant],
                className
            )}
        >
            {children}
        </span>
    );
}
