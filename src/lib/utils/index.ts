import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format currency to ZAR (South African Rand)
 */
export function formatCurrency(amount: number, locale: string = 'en-ZA'): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'ZAR',
        minimumFractionDigits: 2,
    }).format(amount);
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
}

/**
 * Get days between two dates
 */
export function getDaysBetween(date1: Date, date2: Date): number {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}
