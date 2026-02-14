'use client';

import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const usePixel = () => {
    const supabase = getSupabaseBrowserClient();
    const pathname = usePathname();
    const [sessionId, setSessionId] = useState<string>('');

    useEffect(() => {
        // Get or create session ID for funnel tracking
        let storedSessionId = sessionStorage.getItem('analytics_session_id');
        if (!storedSessionId) {
            storedSessionId = uuidv4();
            sessionStorage.setItem('analytics_session_id', storedSessionId);
        }
        setSessionId(storedSessionId);
    }, []);

    const trackEvent = async (eventName: string, metadata: any = {}) => {
        // 1. Facebook Pixel tracking
        if (typeof window !== 'undefined' && window.fbq) {
            // Standard events mapping
            const standardEvents: Record<string, string> = {
                'purchase': 'Purchase',
                'initiate_checkout': 'InitiateCheckout',
                'lead': 'Lead',
                'view_content': 'ViewContent',
                'complete_registration': 'CompleteRegistration',
            };

            if (standardEvents[eventName]) {
                window.fbq('track', standardEvents[eventName], metadata);
            } else {
                window.fbq('trackCustom', eventName, metadata);
            }
        }

        // 2. Supabase Funnel tracking
        try {
            const { data: { user } } = await supabase.auth.getUser();

            await supabase.from('analytics_events').insert({
                session_id: sessionId || sessionStorage.getItem('analytics_session_id'),
                user_id: user?.id || null,
                event_name: eventName,
                page_url: pathname,
                metadata: {
                    ...metadata,
                    timestamp: new Date().toISOString()
                }
            });
        } catch (error) {
            console.error('Error tracking event:', error);
        }
    };

    return { trackEvent };
};
