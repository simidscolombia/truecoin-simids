/**
 * AI Service - v1.8.1
 * Next-Gen Engine: Gemini 2.0 Flash (Forced Update)
 */

export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

const API_KEY = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();

export const aiService = {
    async getResponse(userMessage: string, history: Message[] = []): Promise<string> {
        if (!API_KEY || API_KEY.length < 10) {
            return "Error: API Key no detectada.";
        }

        // Contexto premium para el Cerebro 2.0
        const contents = [
            {
                role: 'user',
                parts: [{ text: "Eres el Cerebro de TrueCoin Simids. Eres una IA de última generación (Gemini 2.0). Responde en español de forma profesional y servicial." }]
            },
            ...history.slice(-4).map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.content }]
            })),
            {
                role: 'user',
                parts: [{ text: userMessage }]
            }
        ];

        // Modelos detectados en tu cuenta (Prioridad 2.0)
        const nextGenModels = [
            "gemini-2.0-flash",
            "gemini-flash-latest",
            "gemini-2.0-flash-lite",
            "gemini-1.5-flash"
        ];

        for (const modelName of nextGenModels) {
            try {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;

                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents })
                });

                const data = await response.json();
                if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
                    return data.candidates[0].content.parts[0].text;
                }
            } catch (e) {
                // Siguiente modelo...
            }
        }

        return "🚨 ERROR FINAL: Aunque los modelos 2.0 están habilitados, la conexión fue rechazada. Por favor, verifica en Google Cloud que el proyecto tenga la facturación activa.";
    }
};
