"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Play } from "lucide-react";

export default function VSLSection() {
    const { t } = useLanguage();

    return (
        <section className="py-12 px-6 bg-black relative overflow-hidden">
            <div className="absolute inset-0 bg-danger-red/5" />

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">
                    {t("sales.vsl.title")}
                </h2>

                <div className="relative aspect-video bg-zinc-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden group cursor-pointer">
                    {/* Placeholder content - in real app would be YouTube/Vimeo embed */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-danger-red rounded-full flex items-center justify-center pl-1 shadow-[0_0_30px_rgba(220,38,38,0.5)] group-hover:scale-110 transition-transform duration-300">
                            <Play className="w-8 h-8 text-white fill-white" />
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-left">
                        <p className="text-white font-bold text-sm md:text-base">
                            {t("sales.vsl.subtitle")}
                        </p>
                    </div>
                </div>

                <p className="mt-6 text-gray-400 text-sm">
                    ⚠️ {t("sales.vsl.warning")}
                </p>
            </div>
        </section>
    );
}
