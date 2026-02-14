import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { verifyPayJSRSignature } from '@/lib/payjsr';
import { getPlanFromProductId } from '@/config/plans';

// Initialize Supabase admin client
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);

export async function POST(req: Request) {
    try {
        const rawBody = await req.text();
        const body = JSON.parse(rawBody);
        const signature = req.headers.get('x-payjsr-signature') || '';
        const secret = process.env.PAYJSR_WEBHOOK_SECRET || '';

        // Verification (can be disabled for testing if secret is not set)
        if (secret && !verifyPayJSRSignature(rawBody, signature, secret)) {
            console.error('Invalid PayJSR signature');
            return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
        }

        const { transaction_id, status, metadata, product_id, amount } = body;
        const userId = metadata?.user_id;

        if (!userId || status !== 'completed') {
            return NextResponse.json({ message: 'Missing user_id or payment not completed' }, { status: 400 });
        }

        // Determine subscription tier from product_id
        const tier = getPlanFromProductId(product_id || '5d13e1e1-99a3-4635-ae7c-cd58943fdd8f');

        // 1. Update the payments table
        const { error: paymentError } = await supabaseAdmin
            .from('payments')
            .insert({
                user_id: userId,
                transaction_id: transaction_id,
                status: 'completed',
                amount: amount || 247.00,
                payment_gateway: 'payjsr',
                created_at: new Date().toISOString(),
            });

        if (paymentError && paymentError.code !== '23505') {
            console.error('Error inserting payment:', paymentError);
            return NextResponse.json({ message: 'Error recording payment' }, { status: 500 });
        }

        // 2. Update the user profile status and tier
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .update({
                payment_status: 'paid',
                payment_verified_at: new Date().toISOString(),
                subscription_tier: tier,
            })
            .eq('id', userId);

        if (profileError) {
            console.error('Error updating profile:', profileError);
            return NextResponse.json({ message: 'Error updating user status' }, { status: 500 });
        }

        // 3. Initialize user progress if not exists
        await supabaseAdmin
            .from('user_progress')
            .insert({
                user_id: userId,
                current_day: 1,
                current_week: 1,
                streak_days: 0,
            })
            .select()
            .single();
        // Ignore duplicate error if already exists

        // 4. Log analytics event
        await supabaseAdmin
            .from('analytics_events')
            .insert({
                event_name: 'purchase_complete',
                user_id: userId,
                metadata: {
                    transaction_id,
                    tier,
                    amount: amount || 247.00
                }
            });

        return NextResponse.json({ received: true, status: 'success' }, { status: 200 });
    } catch (err: any) {
        console.error('Webhook error:', err.message);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
