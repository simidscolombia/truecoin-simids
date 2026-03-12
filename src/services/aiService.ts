import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * AI Service - The "Brain" of TrueCoin Simids
 * v1.5.5 - Standard Model Selection
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
            return "Error: No hay API Key configurada.";
        }

        const prompt = `Responde breve en español como el Cerebro de TrueCoin Simids.\n\nUsuario: ${userMessage}\nCerebro:`;

        // Intentamos con el modelo más compatible del mundo: gemini-1.5-flash
        try {
            console.log("CEREBRO: Intentando con gemini-1.5-flash estándar...");
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (err: any) {
            console.error("CEREBRO FLASH FAILED:", err);

            try {
                // Segundo intento con gemini-pro (legacy 1.0)
                const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
                const resultPro = await modelPro.generateContent(prompt);
                const responsePro = await resultPro.response;
                return responsePro.text();
            } catch (err2: any) {
                return `🚨 ERROR CRÍTICO: Google no reconoce los modelos o tu API Key no tiene permisos. 
                
                POR FAVOR VERIFICA:
                1. Entra a https://aistudio.google.com/
                2. Asegúrate de que tu API Key esté ACTIVA.
                3. Verifica que en Google Cloud Console tengas habilitada la 'Generative Language API'.
                
                Error recibido: ${err2.message}`;
            }
        }
    }
};
