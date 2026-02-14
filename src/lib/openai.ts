
import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
    console.warn('OPENAI_API_KEY is not set in environment variables');
}

export const openai = new OpenAI({
    apiKey: apiKey || 'dummy-key', // Prevent crash during build if key is missing
    dangerouslyAllowBrowser: false, // Ensure this runs on server only
});
