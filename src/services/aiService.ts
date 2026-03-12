import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * AI Service - v1.5.6
 * Fixed "Unused variable" build error
 */

export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

const API_KEY = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
const genAI = new GoogleGenerativeAI(API_KEY);

export const aiService = {
    async getResponse(userMessage: string, history: Message[] = []): Promise<string> {
        if (!API_KEY || API_KEY.length < 10) {
            return "Error: API Key no configurada.";
        }

        // Use history to avoid Vercel build errors
        const context = history.slice(-2).map(m => `${m.role}: ${m.content}`).join('\n');
        const prompt = `Responde en español como el Cerebro de TrueCoin Simids.\n\n${context}\nUsuario: ${userMessage}\nCerebro:`;

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text().trim();
        } catch (err: any) {
            console.error("CEREBRO FAIL:", err);

            // Intento final con gemini-pro
            try {
                const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
                const resultPro = await modelPro.generateContent(prompt);
                const responsePro = await resultPro.response;
                return responsePro.text().trim();
            } catch (err2: any) {
                return `🚨 ERROR: Google rechazó la conexión. Verifica tu API Key en Vercel. (Detalle: ${err2.message})`;
            }
        }
    }
};
