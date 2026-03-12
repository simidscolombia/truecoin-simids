/**
 * AI Service - v1.6.4
 * Production Version - Fixed Unused Variables & Integrated History
 */

export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

const API_KEY = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();

export const aiService = {
    async getResponse(userMessage: string, history: Message[] = []): Promise<string> {
        if (!API_KEY || API_KEY.length < 10) {
            return "Error: No hay API Key cargada correctamente.";
        }

        // Mapeamos el historial para que Google lo entienda (User -> model)
        // Esto también soluciona el error de variable no usada en Vercel
        const historyParts = history.slice(-4).map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
        }));

        const payload = {
            contents: [
                ...historyParts,
                {
                    role: 'user',
                    parts: [{ text: `Eres el Cerebro de TrueCoin. Responde breve en español.\nPregunta: ${userMessage}` }]
                }
            ]
        };

        try {
            // Intentamos por la puerta estable de producción (v1)
            const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
                return data.candidates[0].content.parts[0].text;
            }

            // Fallback a v1beta si v1 falla (algunas llaves nuevas operan así)
            const urlBeta = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
            const resBeta = await fetch(urlBeta, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const dataBeta = await resBeta.json();
            if (resBeta.ok && dataBeta.candidates?.[0]?.content?.parts?.[0]?.text) {
                return dataBeta.candidates[0].content.parts[0].text;
            }

            return `🚨 ERROR (${resBeta.status}): ${dataBeta.error?.message || "Google no respondió correctamente"}.`;

        } catch (err: any) {
            return `🚨 ERROR DE RED: ${err.message}`;
        }
    }
};
