export const PRODUCT_PLAN_MAP: Record<string, string> = {
    '5d13e1e1-99a3-4635-ae7c-cd58943fdd8f': 'premium',
    // Adicione novos IDs de produto aqui conforme necessário
};

export const getPlanFromProductId = (productId: string): string => {
    return PRODUCT_PLAN_MAP[productId] || 'free';
};
