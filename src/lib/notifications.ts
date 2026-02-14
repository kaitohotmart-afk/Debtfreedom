import { getSupabaseBrowserClient } from './supabase/client';

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'motivation' | 'reminder';

export interface Notification {
    id: string;
    user_id: string;
    type: NotificationType;
    title: string;
    message: string;
    link?: string;
    read: boolean;
    created_at: string;
}

export async function createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    link?: string
) {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
        .from('notifications')
        .insert([{
            user_id: userId,
            type,
            title,
            message,
            link
        }])
        .select()
        .single();

    if (error) {
        console.error('Erro ao criar notificação:', error);
        return null;
    }
    return data;
}

export async function savePushSubscription(userId: string, subscription: any) {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
        .from('push_subscriptions')
        .upsert([{
            user_id: userId,
            endpoint: subscription.endpoint,
            p256dh: subscription.keys?.p256dh,
            auth: subscription.keys?.auth,
            payload: JSON.stringify(subscription)
        }], { onConflict: 'user_id, endpoint' });

    if (error) {
        console.error('Erro ao salvar subscrição push:', error);
        return false;
    }
    return true;
}

export async function getNotifications(userId: string) {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

    if (error) {
        console.error('Erro ao buscar notificações:', error);
        return [];
    }
    return data as Notification[];
}

export async function markAsRead(notificationId: string) {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

    if (error) {
        console.error('Erro ao marcar como lida:', error);
    }
}

export async function markAllAsRead(userId: string) {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

    if (error) {
        console.error('Erro ao marcar todas como lidas:', error);
    }
}
