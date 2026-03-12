/**
 * AI Service - v1.6.1
 * Cleaned production version for new API Key with credits.
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

        // Formato de historial compatible con Gemini 1.5
        const historyParts = history.slice(-6).map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
        }));

        const payload = {
            contents: [
                ...historyParts,
                {
                    role: 'user',
                    parts: [{ text: userMessage }]
                }
            ],
            systemInstruction: {
                parts: [{ text: "Eres el Cerebro de TrueCoin Simids, una IA experta en el ecosistema. Responde de forma profesional, clara y amable en español." }]
            }
        };

        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                return `🚨 Google respondió: ${data.error?.message || "Error desconocido"}. (Código: ${response.status})`;
            }

            return data.candidates[0].content.parts[0].text;

        } catch (err: any) {
            return `🚨 Error técnico: ${err.message}. Verifica tu conexión.`;
        }
    }
};
