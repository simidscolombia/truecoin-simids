/**
 * AI Service - v1.6.2
 * Production Stability Version (v1)
 */

export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

const API_KEY = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();

export const aiService = {
    async getResponse(userMessage: string, history: Message[] = []): Promise<string> {
        if (!API_KEY || API_KEY.length < 10) {
            return "Error: No se ha detectado la Nueva API Key.";
        }

        // Combinaciones de URL y Modelo para Producción
        const endpoints = [
            { ver: "v1", mod: "gemini-1.5-flash" },
            { ver: "v1", mod: "gemini-1.5-flash-latest" },
            { ver: "v1", mod: "gemini-pro" }
        ];

        // Construcción de mensajes simplificada
        const contents = [
            ...history.slice(-4).map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.content }]
            })),
            {
                role: 'user',
                parts: [{ text: `Actúa como el Cerebro de TrueCoin Simids. Responde breve en español.\nPregunta: ${userMessage}` }]
            }
        ];

        for (const endpoint of endpoints) {
            try {
                const url = `https://generativelanguage.googleapis.com/${endpoint.ver}/models/${endpoint.mod}:generateContent?key=${API_KEY}`;

                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents })
                });

                const data = await response.json();

                if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
                    return data.candidates[0].content.parts[0].text;
                }

                console.warn(`CEREBRO: Intento fallido con ${endpoint.mod} (${response.status})`);
            } catch (err) {
                // Silently try next endpoint
            }
        }

        return "🚨 ERROR GOOGLE: El servidor no reconoce los modelos estables. Por favor, verifica en Google AI Studio que tu llave no tenga restricciones de API para los modelos Gemini 1.5.";
    }
};
