"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function SignInPage() {
    const { t } = useLanguage();
    const { signIn } = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const { error } = await signIn(email, password);

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            // Will be redirected by middleware based on payment status
            router.push("/app/dashboard");
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        {t("auth.signin.title")}
                    </h1>
                    <p className="text-zinc-400">
                        {t("auth.signin.subtitle")}
                    </p>
                </div>

                <form onSubmit={handleSignIn} className="space-y-6">
                    <Input
                        label={t("auth.signin.email")}
                        type="email"
                        icon={Mail}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder={t("auth.signin.email_placeholder")}
                    />

                    <div className="relative">
                        <Input
                            label={t("auth.signin.password")}
                            type={showPassword ? "text" : "password"}
                            icon={Lock}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder={t("auth.signin.password_placeholder")}
                            containerClassName="mb-1"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-[38px] text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                        <div className="flex justify-end">
                            <Link href="/forgot-password" title="Forgot Password" className="text-xs text-emerald-500 hover:underline">
                                {t("auth.signin.forgot_password")}
                            </Link>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        isLoading={loading}
                        className="w-full py-6"
                    >
                        {t("auth.signin.submit")}
                    </Button>
                </form>

                {/* Sign Up Link */}
                <p className="text-center mt-6 text-zinc-400">
                    {t("auth.signin.no_account")}{" "}
                    <Link href="/signup" className="text-emerald-500 hover:underline font-medium">
                        {t("auth.signin.signup_link")}
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
