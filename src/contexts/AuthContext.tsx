"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface Profile {
    id: string;
    email: string;
    full_name: string | null;
    payment_status: 'unpaid' | 'paid' | 'refunded';
    subscription_tier: string;
    payment_verified_at: string | null;
    onboarding_completed: boolean;
}

interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    session: Session | null;
    loading: boolean;
    signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
    signIn: (email: string, password: string) => Promise<{ error: any }>;
    signOut: () => Promise<void>;
    isPaid: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // We only initialize and use supabase on the client
        const supabase = getSupabaseBrowserClient();

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setProfile(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId: string) => {
        try {
            const supabase = getSupabaseBrowserClient();
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
            setProfile(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (email: string, password: string, fullName?: string) => {
        try {
            const supabase = getSupabaseBrowserClient();
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            });

            if (error) return { error };

            // Create profile
            if (data.user) {
                await supabase.from('profiles').insert({
                    id: data.user.id,
                    email: data.user.email,
                    full_name: fullName,
                    payment_status: 'unpaid',
                    subscription_tier: 'free',
                    onboarding_completed: false,
                });
            }

            return { error: null };
        } catch (error) {
            return { error };
        }
    };

    const signIn = async (email: string, password: string) => {
        const supabase = getSupabaseBrowserClient();
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { error };
    };

    const signOut = async () => {
        const supabase = getSupabaseBrowserClient();
        await supabase.auth.signOut();
        router.push('/');
    };

    const isPaid = profile?.payment_status === 'paid';

    const value = {
        user,
        profile,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        isPaid,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

