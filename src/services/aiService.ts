import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * AI Service - The "Brain" of TrueCoin Simids
 * v1.5.2 - Ultra Debug Mode
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
            return "DEBUG: No hay API Key cargada. Verifica las variables de Vercel.";
        }

        const fullPrompt = `${ECOSYSTEM_KNOWLEDGE}\n\nUsuario: ${userMessage}\nCerebro:`;

        // We will try ONLY the most stable model and catch the RAW error
        try {
            console.log("CEREBRO: Iniciando intento final...");
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent(fullPrompt);
            const response = await result.response;
            return response.text() || "El modelo devolvió vacío.";
        } catch (err: any) {
            console.error("CEREBRO FATAL:", err);

            // Si falla el "pro", intentamos el "1.5-flash" como último recurso antes de rendirnos
            try {
                const modelFlash = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                const result = await modelFlash.generateContent(fullPrompt);
                const response = await result.response;
                return response.text();
            } catch (err2: any) {
                // DEVOLVEMOS EL ERROR CRUDO PARA DIAGNÓSTICO
                return `ERROR DE GOOGLE: ${err2.message || 'Error Desconocido'}. 
                Confirmación de Llave: Empieza por ${API_KEY.substring(0, 6)} y termina en ${API_KEY.substring(API_KEY.length - 4)}.
                Por favor, verifica en Google AI Studio si esta llave está activa y no tiene restricciones de IP.`;
            }
        }
    }
};
