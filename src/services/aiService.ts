/**
 * AI Service - v1.5.9
 * Corrected message property names to match the local interface.
 * Multi-Version Multi-Model Fallback with full context support.
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

        // Construct payload using the correct 'role' and 'content' properties
        const contents = [
            {
                role: 'user',
                parts: [{ text: "Eres el Cerebro de TrueCoin Simids, un experto en economía colaborativa. Responde siempre en español de forma breve y profesional." }]
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

        const payload = { contents };

        const attempts = [
            { ver: "v1beta", mod: "gemini-1.5-flash" },
            { ver: "v1", mod: "gemini-1.5-flash" },
            { ver: "v1", mod: "gemini-pro" },
            { ver: "v1beta", mod: "gemini-pro" }
        ];

        for (const attempt of attempts) {
            try {
                const url = `https://generativelanguage.googleapis.com/${attempt.ver}/models/${attempt.mod}:generateContent?key=${API_KEY}`;

                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();
                if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
                    return data.candidates[0].content.parts[0].text;
                }
            } catch (e) {
                // Silent fail to allow next attempt
            }
        }

        return "🚨 ERROR: Google sigue rechazando la conexión. Verifica tu API Key y permisos en Google AI Studio.";
    }
};
