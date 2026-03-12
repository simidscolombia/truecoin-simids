import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * AI Service - The "Brain" of TrueCoin Simids
 * v1.5.3 - Fixed Build Errors & Detailed Diagnostics
 */

export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

const API_KEY = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
const genAI = new GoogleGenerativeAI(API_KEY);

const ECOSYSTEM_KNOWLEDGE = `Eres el Cerebro de TrueCoin Simids. Responde breve en español.`;

export const aiService = {
    async getResponse(userMessage: string, history: Message[] = []): Promise<string> {
        if (!API_KEY || API_KEY.length < 10) {
            return "DEBUG: No hay API Key cargada correctamente. Verifica Vercel Settings.";
        }

        // Use history to avoid TS unused variable error
        const historyText = history.slice(-3).map(m => `${m.role}: ${m.content}`).join('\n');
        const fullPrompt = `${ECOSYSTEM_KNOWLEDGE}\n\n[CONTEXTO RECIENTE]\n${historyText}\n\nUsuario: ${userMessage}\nCerebro:`;

        try {
            // Intentamos con 1.5-flash que es el más moderno
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(fullPrompt);
            const response = await result.response;
            return response.text() || "Respuesta vacía.";
        } catch (err: any) {
            console.error("CEREBRO ERROR 1:", err);

            try {
                // Fallback a gemini-pro (clásico)
                const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
                const resultPro = await modelPro.generateContent(fullPrompt);
                const responsePro = await resultPro.response;
                return responsePro.text();
            } catch (err2: any) {
                console.error("CEREBRO ERROR 2:", err2);
                return `DETALLE TÉCNICO GOOGLE: ${err2.message || 'Error Desconocido'}. 
                Llave configurada: ${API_KEY.substring(0, 6)}...${API_KEY.substring(API_KEY.length - 4)}.
                Por favor, verifica en Google AI Studio si esta llave tiene habilitado el 'Generative Language API'.`;
            }
        }
    }
};
