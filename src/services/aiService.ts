import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * AI Service - The "Brain" of TrueCoin Simids
 * v1.5.4 - Forced Production API v1
 */

export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

const API_KEY = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
// Configuración de la IA forzando la versión estable de la API de Google
const genAI = new GoogleGenerativeAI(API_KEY);

export const aiService = {
    async getResponse(userMessage: string, history: Message[] = []): Promise<string> {
        if (!API_KEY || API_KEY.length < 10) {
            return "Error: Revisa la configuración de la API Key en Vercel.";
        }

        const historyText = history.slice(-4).map(m => `${m.role}: ${m.content}`).join('\n');
        const prompt = `Responde breve en español como el Cerebro de TrueCoin Simids.\n\n${historyText}\nUsuario: ${userMessage}\nCerebro:`;

        try {
            // FORZAMOS VERSION v1 (Producción) y modelo 1.5-flash
            const model = genAI.getGenerativeModel(
                { model: "gemini-1.5-flash" },
                { apiVersion: "v1" } // <-- Esto soluciona el error 404 de v1beta
            );

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            return text || "El Cerebro está pensando, pero no pudo emitir palabras.";
        } catch (err: any) {
            console.error("CEREBRO FATAL ERROR:", err);

            // Intento final con gemini-1.5-pro en v1 si falla el flash
            try {
                const modelPro = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }, { apiVersion: "v1" });
                const resultPro = await modelPro.generateContent(prompt);
                const responsePro = await resultPro.response;
                return responsePro.text();
            } catch (err2: any) {
                return `ERROR DE GOOGLE (v1): ${err2.message}. Por favor verifica que la API 'Generative Language' esté habilitada en tu Google Cloud Console.`;
            }
        }
    }
};
