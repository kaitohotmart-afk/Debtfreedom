import crypto from 'crypto';

/**
 * Verifica se a assinatura do webhook do PayJSR é válida.
 * @param payload - O corpo da requisição em formato string/buffer.
 * @param signature - A assinatura recebida no cabeçalho.
 * @param secret - O segredo compartilhado configurado no PayJSR.
 */
export function verifyPayJSRSignature(payload: string, signature: string, secret: string): boolean {
    if (!signature || !secret) return false;

    const hash = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

    return hash === signature;
}
