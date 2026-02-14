'use client';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LucideIcon } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: LucideIcon;
    containerClassName?: string;
}

export default function Input({
    label,
    error,
    icon: Icon,
    className,
    containerClassName,
    id,
    ...props
}: InputProps) {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
        <div className={cn('space-y-2', containerClassName)}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1 cursor-pointer"
                >
                    {label}
                </label>
            )}
            <div className="relative group">
                {Icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors">
                        <Icon className="w-4 h-4" />
                    </div>
                )}
                <input
                    id={inputId}
                    className={cn(
                        'w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 px-4 outline-none transition-all duration-200 focus:border-emerald-500/50 focus:bg-zinc-900 focus:ring-4 focus:ring-emerald-500/10 placeholder:text-zinc-600 text-white',
                        Icon && 'pl-12',
                        error && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10',
                        className
                    )}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-[10px] font-bold text-red-500 ml-1 uppercase tracking-tighter">
                    {error}
                </p>
            )}
        </div>
    );
}
