"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, Check, X, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function SignUpPage() {
    const { t } = useLanguage();
    const { signUp } = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Password strength validation
    const passwordChecks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
    };
    const passwordStrength = Object.values(passwordChecks).filter(Boolean).length;

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!agreedToTerms) {
            setError(t("auth.errors.terms_required"));
            return;
        }

        if (passwordStrength < 3) {
            setError(t("auth.errors.weak_password"));
            return;
        }

        setLoading(true);

        const { error } = await signUp(email, password, fullName);

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push("/checkout");
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
                        {t("auth.signup.title")}
                    </h1>
                    <p className="text-zinc-400">
                        {t("auth.signup.subtitle")}
                    </p>
                </div>

                <form onSubmit={handleSignUp} className="space-y-6">
                    <Input
                        label={t("auth.signup.full_name")}
                        icon={User}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        placeholder={t("auth.signup.full_name_placeholder")}
                    />

                    <Input
                        label={t("auth.signup.email")}
                        type="email"
                        icon={Mail}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder={t("auth.signup.email_placeholder")}
                    />

                    <div className="relative">
                        <Input
                            label={t("auth.signup.password")}
                            type={showPassword ? "text" : "password"}
                            icon={Lock}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder={t("auth.signup.password_placeholder")}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-[38px] text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Password Strength Indicators */}
                    {password && (
                        <div className="mt-3 space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                {passwordChecks.length ? (
                                    <Check className="w-4 h-4 text-emerald-500" />
                                ) : (
                                    <X className="w-4 h-4 text-zinc-500" />
                                )}
                                <span className={passwordChecks.length ? "text-emerald-500" : "text-zinc-500"}>
                                    {t("auth.signup.password_length")}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                {passwordChecks.uppercase ? (
                                    <Check className="w-4 h-4 text-emerald-500" />
                                ) : (
                                    <X className="w-4 h-4 text-zinc-500" />
                                )}
                                <span className={passwordChecks.uppercase ? "text-emerald-500" : "text-zinc-500"}>
                                    {t("auth.signup.password_uppercase")}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                {passwordChecks.number ? (
                                    <Check className="w-4 h-4 text-emerald-500" />
                                ) : (
                                    <X className="w-4 h-4 text-zinc-500" />
                                )}
                                <span className={passwordChecks.number ? "text-emerald-500" : "text-zinc-500"}>
                                    {t("auth.signup.password_number")}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Terms Checkbox */}
                    <div className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                            className="mt-1 w-4 h-4 accent-emerald-500"
                        />
                        <label htmlFor="terms" className="text-sm text-zinc-400">
                            {t("auth.signup.terms_prefix")}{" "}
                            <Link href="/terms" className="text-emerald-500 hover:underline">
                                {t("auth.signup.terms_link")}
                            </Link>{" "}
                            {t("auth.signup.terms_and")}{" "}
                            <Link href="/privacy" className="text-emerald-500 hover:underline">
                                {t("auth.signup.privacy_link")}
                            </Link>
                        </label>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        isLoading={loading}
                        disabled={passwordStrength < 3 || !agreedToTerms}
                        className="w-full py-6"
                    >
                        {t("auth.signup.submit")}
                    </Button>
                </form>

                {/* Sign In Link */}
                <p className="text-center mt-6 text-zinc-400">
                    {t("auth.signup.already_have_account")}{" "}
                    <Link href="/signin" className="text-emerald-500 hover:underline font-medium">
                        {t("auth.signup.signin_link")}
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
