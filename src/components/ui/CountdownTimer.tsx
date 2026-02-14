"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export default function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState({ minutes: 15, seconds: 0 });

    useEffect(() => {
        // Simple 15 minute timer that resets on refresh for MVP
        // In production, use localStorage to persist
        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 };
                } else if (prev.minutes > 0) {
                    return { minutes: prev.minutes - 1, seconds: 59 };
                } else {
                    clearInterval(interval);
                    return { minutes: 0, seconds: 0 };
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-2 text-danger-red font-mono font-bold text-lg bg-danger-red/10 px-3 py-1 rounded-lg border border-danger-red/20 animate-pulse">
            <Clock className="w-4 h-4" />
            <span>
                {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </span>
        </div>
    );
}
