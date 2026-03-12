/**
 * AI Service - v1.5.7
 * Direct REST API implementation to bypass SDK 404 issues
 */

export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

const API_KEY = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();

export const aiService = {
    async getResponse(userMessage: string, history: Message[] = []): Promise<string> {
        if (!API_KEY || API_KEY.length < 10) {
            return "Error: API Key no configurada correctamente en Vercel.";
        }

        // URL estable de producción (v1)
        const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        const payload = {
            contents: [
                {
                    parts: [{ text: "Eres el Cerebro de TrueCoin Simids. Responde breve en español." }]
                },
                ...history.slice(-4).map(m => ({
                    role: m.role === 'user' ? 'user' : 'model',
                    parts: [{ text: m.content }]
                })),
                {
                    role: 'user',
                    parts: [{ text: userMessage }]
                }
            ],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 500,
            }
        };

        try {
            console.log("CEREBRO: Intentando conexión directa REST...");
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("GOOGLE API ERROR:", data);
                throw new Error(data.error?.message || "Error desconocido de Google");
            }

            return data.candidates[0].content.parts[0].text;

        } catch (err: any) {
            console.error("CEREBRO REST FAIL:", err);

            // Intento con el modelo pro 1.0 si el 1.5 falla
            if (err.message.includes('404')) {
                try {
                    const PRO_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;
                    const responsePro = await fetch(PRO_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    const dataPro = await responsePro.json();
                    return dataPro.candidates[0].content.parts[0].text;
                } catch (proErr: any) {
                    return `🚨 ERROR REST FINAL: ${proErr.message}. Verifica que la 'Generative Language API' esté activa en tu consola de Google.`;
                }
            }

            return `Lo siento, el Cerebro dice: Error de conexión (${err.message})`;
        }
    }
};
