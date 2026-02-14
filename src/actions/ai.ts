'use server';

import { openai } from '@/lib/openai';

interface FinancialContext {
    monthlyIncome: number;
    totalDebt: number;
    monthlyExpenses: number;
    currency?: string;
}

export async function getFinancialAdvice(context: FinancialContext) {
    if (!process.env.OPENAI_API_KEY) {
        return {
            success: false,
            message: 'AI Service unavailable (Missing API Key)',
        };
    }

    try {
        const prompt = `
      Act as a compassionate but firm South African financial advisor.
      Analyze the following financial data:
      - Monthly Income: R${context.monthlyIncome}
      - Monthly Expenses: R${context.monthlyExpenses}
      - Total Debt: R${context.totalDebt}

      Provide a response in JSON format with the following fields:
      - "health_score": number (0-100)
      - "status": string ("Critical", "Warning", "Stable", "Good", "Excellent")
      - "immediate_action": string (one specific powerful action to take now)
      - "advice": string (short paragraph, max 300 characters, empathetic but direct)
      
      Keep the tone encouraging but realistic. Focus on debt elimination.
    `;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: 'You are a financial debt expert.' },
                { role: 'user', content: prompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
        });

        const content = response.choices[0].message.content;
        if (!content) throw new Error('No content received from AI');

        const result = JSON.parse(content);
        return { success: true, data: result };

    } catch (error) {
        console.error('AI Error:', error);
        return {
            success: false,
            message: 'Failed to generate advice. Please try again later.',
        };
    }
}
