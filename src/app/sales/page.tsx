"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Check, X, Shield, ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import Image from "next/image";

import StickyCTA from "@/components/ui/StickyCTA";
import RecentPurchasePopup from "@/components/marketing/RecentPurchasePopup";
import CountdownTimer from "@/components/ui/CountdownTimer";
import { usePixel } from "@/hooks/usePixel";
import { useEffect } from "react";



export default function SalesPage() {
    const { t } = useLanguage();
    const { trackEvent } = usePixel();

    useEffect(() => {
        trackEvent("view_content", { content_name: "Sales Page", content_category: "Marketing" });
    }, []);

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Section - The "Solution" */}
            <section className="relative min-h-[90vh] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <div className="absolute inset-0 gradient-hero opacity-20 pointer-events-none" />

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="z-10 max-w-4xl"
                >
                    <div className="inline-block px-4 py-1 rounded-full border border-danger-red/50 bg-danger-red/10 text-danger-red font-mono text-xs tracking-widest mb-6">
                        {t("sales.hero.badge")}
                    </div>

                    <h1 className="text-4xl md:text-7xl font-display font-bold mb-6 leading-tight">
                        {t("sales.hero.headline_start")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-danger-red to-orange-500">{t("sales.hero.headline_end")}</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: t("sales.hero.subheadline").replace("<bold>", "<b class='text-white'>").replace("</bold>", "</b>") }}
                    />

                    <Link
                        href="/signup"
                        onClick={() => trackEvent("initiate_checkout", { location: "hero" })}
                        className="px-8 py-4 bg-white text-black font-bold text-lg rounded-full hover:scale-105 transition-transform flex items-center gap-2 mx-auto w-fit"
                    >
                        {t("sales.hero.cta")} <ArrowRight className="w-5 h-5" />
                    </Link>
                </motion.div>
            </section>



            {/* Problem / Agitation - "The Old Way vs The New Way" */}
            <section className="py-20 px-6 bg-zinc-900/50">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
                    {/* The Old Way (Pain) */}
                    <div className="p-8 rounded-3xl border border-white/5 bg-black/50">
                        <h3 className="text-2xl font-bold text-gray-400 mb-6 flex items-center gap-2">
                            <X className="text-red-500" /> {t("sales.problem.title")}
                        </h3>
                        <ul className="space-y-4 text-gray-400">
                            <li className="flex gap-3"><X className="w-5 h-5 text-red-900 shrink-0" /> {t("sales.problem.items.1")}</li>
                            <li className="flex gap-3"><X className="w-5 h-5 text-red-900 shrink-0" /> {t("sales.problem.items.2")}</li>
                            <li className="flex gap-3"><X className="w-5 h-5 text-red-900 shrink-0" /> {t("sales.problem.items.3")}</li>
                            <li className="flex gap-3"><X className="w-5 h-5 text-red-900 shrink-0" /> {t("sales.problem.items.4")}</li>
                        </ul>
                    </div>

                    {/* The New Way (Solution) */}
                    <div className="p-8 rounded-3xl border border-success-green/30 bg-success-green/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-success-green/10 blur-3xl rounded-full" />
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <Check className="text-success-green" /> {t("sales.solution.title")}
                        </h3>
                        <ul className="space-y-4 text-gray-200">
                            <li className="flex gap-3"><Check className="w-5 h-5 text-success-green shrink-0" /> <span dangerouslySetInnerHTML={{ __html: t("sales.solution.items.1") }} /></li>
                            <li className="flex gap-3"><Check className="w-5 h-5 text-success-green shrink-0" /> <span dangerouslySetInnerHTML={{ __html: t("sales.solution.items.2") }} /></li>
                            <li className="flex gap-3"><Check className="w-5 h-5 text-success-green shrink-0" /> <span dangerouslySetInnerHTML={{ __html: t("sales.solution.items.3") }} /></li>
                            <li className="flex gap-3"><Check className="w-5 h-5 text-success-green shrink-0" /> <span dangerouslySetInnerHTML={{ __html: t("sales.solution.items.4") }} /></li>
                            <li className="flex gap-3"><Check className="w-5 h-5 text-success-green shrink-0" /> <span dangerouslySetInnerHTML={{ __html: t("sales.solution.items.5") }} /></li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* The Offer - What they get */}
            <section className="py-24 px-6 relative">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-display font-bold mb-12">
                        {t("sales.offer.title")}
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6 mb-16">
                        {[1, 2, 3].map((num) => (
                            <div key={num} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-danger-red/30 transition-colors">
                                <h4 className="text-xl font-bold mb-2 text-danger-red">{t(`sales.offer.cards.${num}.title`)}</h4>
                                <p className="text-sm text-gray-400">{t(`sales.offer.cards.${num}.desc`)}</p>
                            </div>
                        ))}
                    </div>

                    {/* Pricing Card - Professional Refinement */}
                    <div className="relative mx-auto max-w-md p-[1px] rounded-3xl bg-gradient-to-b from-amber-200 via-yellow-500 to-amber-900 shadow-2xl shadow-amber-900/20">
                        <div className="bg-zinc-950 rounded-[23px] p-8 md:p-12 h-full relative overflow-hidden">
                            {/* Glossy Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-600 to-red-800 text-white text-[10px] tracking-widest font-bold px-4 py-1 rounded-b-lg whitespace-nowrap z-10 shadow-lg uppercase">
                                {t("sales.pricing.limited")}
                            </div>

                            <div className="flex justify-center mb-8 mt-4">
                                <CountdownTimer />
                            </div>

                            <div className="text-red-500/80 line-through text-lg mb-1 font-mono">{t("sales.pricing.original")}</div>
                            <div className="flex items-baseline justify-center gap-1 mb-6">
                                <span className="text-5xl md:text-6xl font-bold text-white tracking-tight">
                                    {t("sales.pricing.price")}
                                </span>
                                <span className="text-xl text-zinc-500 font-normal">
                                    {t("sales.pricing.cents")}
                                </span>
                            </div>

                            <p className="text-zinc-400 text-sm mb-8 pb-8 border-b border-white/5">
                                {t("sales.pricing.lifetime")}
                            </p>

                            <button
                                onClick={() => {
                                    trackEvent("initiate_checkout", { location: "pricing_card" });
                                    window.location.href = "/signup";
                                }}
                                className="group w-full py-4 bg-gradient-to-b from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 text-white font-bold rounded-xl mb-6 shadow-lg shadow-emerald-900/50 transition-all transform hover:-translate-y-1 active:translate-y-0 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none blur-md" />
                                <span className="relative flex items-center justify-center gap-2 tracking-wide">
                                    {t("sales.pricing.cta")} <ArrowRight className="w-5 h-5" />
                                </span>
                            </button>

                            <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 font-medium">
                                <Shield size={14} className="text-amber-500" />
                                {t("sales.pricing.guarantee")}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials - Social Proof - ENHANCED */}
            <section className="py-20 px-6 bg-zinc-900/30">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-white">
                            {t("sales.testimonials.title")}
                        </h2>
                        <p className="text-xl text-gray-400">{t("sales.testimonials.subtitle")}</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((num) => (
                            <div key={num} className="p-8 rounded-2xl bg-gradient-to-b from-white/10 to-black border border-white/10 relative hover:border-white/20 transition-all group">
                                <div className="absolute -top-6 left-8 bg-black border border-white/10 p-1 rounded-full overflow-hidden w-14 h-14">
                                    <Image
                                        src={
                                            num === 1 ? "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=150&h=150" :
                                                num === 2 ? "https://images.unsplash.com/photo-1522512115668-c09775d6f424?auto=format&fit=crop&w=150&h=150" :
                                                    "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=150&h=150"
                                        }
                                        alt="User"
                                        width={56}
                                        height={56}
                                        className="grayscale group-hover:grayscale-0 transition-all object-cover"
                                    />
                                </div>

                                <div className="flex gap-1 mb-4 mt-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className={cn("w-4 h-4 fill-yellow-500 text-yellow-500",
                                            // Handle rating "4" for item 2
                                            (num === 2 && star === 5) ? "opacity-30" : ""
                                        )} />
                                    ))}
                                </div>

                                <p className="text-gray-300 italic mb-6 leading-relaxed min-h-[80px]">"{t(`sales.testimonials.items.${num}.text`)}"</p>

                                <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                                    <div>
                                        <div className="text-white font-bold text-sm">
                                            {t(`sales.testimonials.items.${num}.author`)}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {t(`sales.testimonials.items.${num}.role`)}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-green-500 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
                                        <Check className="w-3 h-3" /> {t("sales.testimonials.verified")}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-16 flex flex-wrap justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Placeholder for Trust Logos if needed, using text for now or Lucide icons */}
                        <div className="flex items-center gap-2"><Shield className="w-5 h-5" /> Secure Payment</div>
                        <div className="flex items-center gap-2"><Check className="w-5 h-5" /> Verified Results</div>
                        <div className="flex items-center gap-2"><Star className="w-5 h-5" /> 4.9/5 Average Rating</div>
                    </div>
                </div>
            </section>

            {/* FAQ - Objection Handling */}
            <section className="py-20 px-6 bg-black">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-10 text-gray-500 tracking-widest">
                        {t("sales.faq.title")}
                    </h2>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                            <details key={num} className="group bg-zinc-900 rounded-xl border border-white/5 open:border-white/10 transition-colors">
                                <summary className="flex cursor-pointer items-center justify-between p-6 font-medium text-gray-200 list-none text-lg">
                                    {t(`sales.faq.items.${num}.q`)}
                                    <span className="transition group-open:rotate-180">
                                        <ArrowRight className="w-5 h-5 rotate-90" />
                                    </span>
                                </summary>
                                <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                                    <p>{t(`sales.faq.items.${num}.a`)}</p>
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ / Closing */}
            <section className="py-20 px-6 text-center border-t border-white/10">
                <p className="text-gray-500 text-sm max-w-lg mx-auto">
                    {t("sales.footer")}
                </p>
            </section>

            <StickyCTA />
            <RecentPurchasePopup />
        </div>
    );
}
