/**
 * AI Service - v1.6.5
 * Precision Routing based on Google Cloud Console active versions
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

        const contents = [
            ...history.slice(-4).map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.content }]
            })),
            {
                role: 'user',
                parts: [{ text: `Responde en español de forma breve.\nPregunta: ${userMessage}` }]
            }
        ];

        // Rutas exactas habilitadas en el panel del usuario
        const endpoints = [
            { ver: "v1", mod: "gemini-1.5-flash" },
            { ver: "v1beta2", mod: "gemini-1.5-flash" },
            { ver: "v1beta3", mod: "gemini-1.5-flash" },
            { ver: "v1", mod: "gemini-pro" }
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
            } catch (err) {
                // Sigue al siguiente endpoint
            }
        }

        return "🚨 ERROR: Google no reconoce los modelos en las versiones v1, v1beta2 o v1beta3 habilitadas. Verifica en Google AI Studio que la API Key sea de tipo 'Unlimited' o tenga cuota disponible.";
    }
};
