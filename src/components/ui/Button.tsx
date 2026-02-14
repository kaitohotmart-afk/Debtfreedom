'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
    icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
    children?: React.ReactNode;
}

export default function Button({
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    icon: Icon,
    iconPosition = 'left',
    children,
    disabled,
    ...props
}: ButtonProps) {
    const variants = {
        primary: 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]',
        secondary: 'bg-zinc-800 text-white hover:bg-zinc-700 border border-white/10',
        danger: 'bg-red-600 text-white hover:bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.2)]',
        ghost: 'bg-transparent text-zinc-400 hover:text-white hover:bg-white/5',
        outline: 'bg-transparent border border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-6 py-2.5 text-sm',
        lg: 'px-8 py-3.5 text-base',
        icon: 'p-2',
    };

    return (
        <motion.button
            whileHover={!disabled && !isLoading ? { scale: 1.02 } : {}}
            whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
            disabled={disabled || isLoading}
            className={cn(
                'relative inline-flex items-center justify-center gap-2 font-black uppercase tracking-wider rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-inherit">
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            <span className={cn('flex items-center gap-2', isLoading && 'opacity-0')}>
                {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
                {children}
                {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
            </span>
        </motion.button>
    );
}
