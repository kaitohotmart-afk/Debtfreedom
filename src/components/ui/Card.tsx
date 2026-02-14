'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardProps extends HTMLMotionProps<'div'> {
    variant?: 'premium' | 'danger' | 'success' | 'outline' | 'ghost';
    glow?: boolean;
}

export default function Card({
    className,
    variant = 'premium',
    glow = false,
    children,
    ...props
}: CardProps) {
    const variants = {
        premium: 'bg-zinc-900/40 border-white/10 backdrop-blur-xl',
        danger: 'bg-red-950/20 border-red-500/20 backdrop-blur-xl',
        success: 'bg-emerald-950/20 border-emerald-500/20 backdrop-blur-xl',
        outline: 'bg-transparent border-white/5',
        ghost: 'bg-transparent border-transparent',
    };

    const glowStyles = {
        premium: 'shadow-[0_0_30px_rgba(255,255,255,0.02)]',
        danger: 'shadow-[0_0_30px_rgba(220,38,38,0.05)]',
        success: 'shadow-[0_0_30px_rgba(16,185,129,0.05)]',
        outline: '',
        ghost: '',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                'rounded-3xl border p-6 transition-all duration-300',
                variants[variant],
                glow && glowStyles[variant],
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}
