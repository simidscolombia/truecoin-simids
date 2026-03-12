/**
 * AI Service - v1.8.4
 * Fixed build error by integrating history into the payload.
 * Master Key Engine: Dual Support (2.0 Flash & 1.5 Pro)
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

        // Mapeamos el historial para que Google lo entienda (User -> model)
        // Esto soluciona el error de 'history' no usado en Vercel
        const historyParts = history.slice(-4).map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
        }));

        const contents = [
            ...historyParts,
            {
                role: 'user',
                parts: [{ text: `Responde en español de forma breve.\nPregunta: ${userMessage}` }]
            }
        ];

        const engineConfigs = [
            { ver: "v1beta", mod: "gemini-2.0-flash" },
            { ver: "v1beta", mod: "gemini-1.5-pro" },
            { ver: "v1", mod: "gemini-1.5-flash" }
        ];

        let lastError = "";

        for (const config of engineConfigs) {
            try {
                const url = `https://generativelanguage.googleapis.com/${config.ver}/models/${config.mod}:generateContent?key=${API_KEY}`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents })
                });

                const data = await response.json();
                if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
                    return data.candidates[0].content.parts[0].text;
                }

                lastError = data.error?.message || "Error desconocido";
            } catch (e) {
                // Siguiente config
            }
        }

        return `🚨 ERROR: Google rechazó la conexión. MOTIVO: ${lastError}.`;
    }
};
