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
        const { searchParams } = new URL(req.url);
        const urlKey = searchParams.get('key');
        const expectedKey = process.env.PAYJSR_WEBHOOK_KEY;

        // Security check: URL Secret Key
        if (expectedKey && urlKey !== expectedKey) {
            console.error('Unauthorized webhook access attempt');
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const rawBody = await req.text();
        const body = JSON.parse(rawBody);

        // PayJSR signature verification (optional, as URL Secret is easier)
        const signature = req.headers.get('x-payjsr-signature') || '';
        const signatureSecret = process.env.PAYJSR_WEBHOOK_SECRET;

        // Validation only if signatureSecret is provided
        if (signatureSecret && !verifyPayJSRSignature(rawBody, signature, signatureSecret)) {
            console.error('Invalid PayJSR signature');
            return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
        }

        const { transaction_id, status, metadata, product_id, amount, email: customerEmail } = body;
        const userId = metadata?.user_id;

        // 1. Validações Básicas
        if (status !== 'completed') {
            return NextResponse.json({ message: 'Payment not completed' }, { status: 400 });
        }

        // Determine subscription tier from product_id
        const tier = getPlanFromProductId(product_id || '5d13e1e1-99a3-4635-ae7c-cd58943fdd8f');

        // 2. Professional Atomic Update via RPC
        // This handles: Payment insertion, profile update, progress init, and analytics
        const { data: rpcResult, error: rpcError } = await supabaseAdmin.rpc('handle_payment_activation', {
            p_user_id: userId || null,
            p_amount: amount ? parseFloat(amount) : 247.00,
            p_transaction_id: transaction_id,
            p_tier: tier,
            p_email: customerEmail || null
        });

        if (rpcError || !rpcResult?.success) {
            console.error('RPC Activation Error:', rpcError || rpcResult?.message);
            return NextResponse.json({
                message: rpcResult?.message || 'Error executing activation transaction',
                details: rpcError
            }, { status: 500 });
        }

        return NextResponse.json({
            received: true,
            status: 'success',
            user_id: rpcResult.user_id
        }, { status: 200 });

    } catch (err: any) {
        console.error('Webhook error:', err.message);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
