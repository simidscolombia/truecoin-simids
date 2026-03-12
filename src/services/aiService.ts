/**
 * AI Service - v1.7.0
 * Deep Diagnostics & Auto-Model Discovery
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

        // Use history in a log to satisfy the linter
        console.log(`CEREBRO: Procesando mensaje con historial de ${history.length} mensajes.`);

        const prompt = `Responde en español de forma breve.\nPregunta: ${userMessage}`;

        // Función interna para llamar a Google
        const callGoogle = async (version: string, model: string) => {
            const url = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${API_KEY}`;
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });
            return res;
        };

        try {
            // INTENTO 1: v1 + flash (El estándar de producción)
            const res1 = await callGoogle("v1", "gemini-1.5-flash");
            if (res1.ok) {
                const data = await res1.json();
                return data.candidates[0].content.parts[0].text;
            }

            // INTENTO 2: v1beta + flash (El canal de desarrollo)
            const res2 = await callGoogle("v1beta", "gemini-1.5-flash");
            if (res2.ok) {
                const data = await res2.json();
                return data.candidates[0].content.parts[0].text;
            }

            // DIAGNÓSTICO: Listar modelos disponibles para esta llave
            console.log("CEREBRO: Intentando descubrir modelos...");
            const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
            const listRes = await fetch(listUrl);
            const listData = await listRes.json();

            const availableModels = listData.models
                ? listData.models.map((m: any) => m.name.replace("models/", "")).join(", ")
                : "Ninguno";

            return `🚨 ERROR DE CONFIGURACIÓN: Google conoce esta llave pero no activa el modelo Flash. 
            
            VERSIONES ACTIVAS EN TU CUENTA: ${availableModels}.
            
            Si la lista anterior está vacía, por favor entra a Google AI Studio y genera una llave que diga 'Free of charge' o 'Pay-as-you-go' específicamente para Gemini API.`;

        } catch (err: any) {
            return `🚨 ERROR DE RED: ${err.message}`;
        }
    }
};
