"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Shield, Lock, Check, CreditCard, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePixel } from "@/hooks/usePixel";

export default function CheckoutPage() {
    const { t } = useLanguage();
    const { user, profile, loading, isPaid } = useAuth();
    const { trackEvent } = usePixel();
    const router = useRouter();
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
        if (!loading && user && !isPaid) {
            trackEvent("initiate_checkout", { email: user.email });
        }
    }, [loading, user, isPaid]);

    useEffect(() => {
        // Redirect to signin if not authenticated
        if (!loading && !user) {
            router.push("/signin");
        }

        // Redirect to dashboard if already paid
        if (!loading && isPaid) {
            router.push("/app/dashboard");
        }
    }, [user, loading, isPaid, router]);

    const handlePayment = () => {
        setRedirecting(true);

        // PayJSR redirect URL with user metadata
        const returnUrl = `${window.location.origin}/thank-you`;
        const paymentUrl = `https://payjsr.com/checkout?product=5d13e1e1-99a3-4635-ae7c-cd58943fdd8f&metadata[user_id]=${user?.id}&metadata[email]=${user?.email}&return_url=${encodeURIComponent(returnUrl)}`;

        window.location.href = paymentUrl;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white text-xl">{t("common.loading")}</div>
            </div>
        );
    }

    if (!user || isPaid) {
        return null; // Will redirect via useEffect
    }

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="max-w-4xl mx-auto py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        {t("checkout.title")}
                    </h1>
                    <p className="text-zinc-400 text-lg">
                        {t("checkout.subtitle")}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Order Summary */}
                    <div className="space-y-6">
                        <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
                            <h2 className="text-2xl font-bold mb-6">{t("checkout.order_summary")}</h2>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-emerald-500 mt-1" />
                                    <div>
                                        <p className="font-medium">{t("checkout.feature_1")}</p>
                                        <p className="text-sm text-zinc-400">{t("checkout.feature_1_desc")}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-emerald-500 mt-1" />
                                    <div>
                                        <p className="font-medium">{t("checkout.feature_2")}</p>
                                        <p className="text-sm text-zinc-400">{t("checkout.feature_2_desc")}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-emerald-500 mt-1" />
                                    <div>
                                        <p className="font-medium">{t("checkout.feature_3")}</p>
                                        <p className="text-sm text-zinc-400">{t("checkout.feature_3_desc")}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-zinc-800 mt-6 pt-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-zinc-400">{t("checkout.subtotal")}</span>
                                    <span className="line-through text-zinc-500">R 997.00</span>
                                </div>
                                <div className="flex justify-between items-center text-xl font-bold">
                                    <span>{t("checkout.total")}</span>
                                    <span className="text-3xl text-emerald-500">R 247<span className="text-lg">.00</span></span>
                                </div>
                                <p className="text-sm text-zinc-500 mt-2">{t("checkout.one_time")}</p>
                            </div>
                        </div>

                        {/* Guarantee */}
                        <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-6">
                            <div className="flex items-start gap-3">
                                <Shield className="w-6 h-6 text-emerald-500 mt-1" />
                                <div>
                                    <h3 className="font-bold text-emerald-400 mb-2">{t("checkout.guarantee_title")}</h3>
                                    <p className="text-sm text-zinc-300">{t("checkout.guarantee_text")}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Section */}
                    <div className="space-y-6">
                        <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
                            <h2 className="text-2xl font-bold mb-6">{t("checkout.payment_details")}</h2>

                            {/* Account Info */}
                            <div className="bg-zinc-950 rounded-xl p-4 mb-2">
                                <p className="text-sm text-zinc-400 mb-1">{t("checkout.account")}</p>
                                <p className="font-medium">{user.email}</p>
                            </div>

                            {/* Email Notice */}
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mb-6 flex gap-3 items-center">
                                <Shield className="w-5 h-5 text-emerald-500 shrink-0" />
                                <p className="text-xs text-emerald-200">
                                    {t("checkout.email_notice")}
                                </p>
                            </div>


                            {/* Payment Button */}
                            <button
                                onClick={handlePayment}
                                disabled={redirecting}
                                className="w-full py-4 bg-gradient-to-b from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/50 transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 mb-4"
                            >
                                {redirecting ? (
                                    <>{t("common.loading")}</>
                                ) : (
                                    <>
                                        <CreditCard className="w-5 h-5" />
                                        {t("checkout.pay_now")}
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>

                            {/* Security Badges */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-zinc-400">
                                    <Lock className="w-4 h-4" />
                                    <span>{t("checkout.secure_payment")}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-zinc-400">
                                    <Shield className="w-4 h-4" />
                                    <span>{t("checkout.data_protected")}</span>
                                </div>
                            </div>
                        </div>

                        {/* Need Help */}
                        <div className="text-center">
                            <p className="text-zinc-400 text-sm">
                                {t("checkout.need_help")}{" "}
                                <Link href="/contact" className="text-emerald-500 hover:underline">
                                    {t("checkout.contact_us")}
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
