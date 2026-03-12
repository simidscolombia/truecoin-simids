/**
 * AI Service - v1.6.0
 * Transparent Diagnostics Mode
 */

export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

const API_KEY = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();

export const aiService = {
    async getResponse(userMessage: string, history: Message[] = []): Promise<string> {
        if (!API_KEY || API_KEY.length < 10) {
            return "Error: API Key no detectada. Revisa Vercel.";
        }

        const payload = {
            contents: [{
                parts: [{ text: `Responde en español como el Cerebro de TrueCoin.\n\nUsuario: ${userMessage}` }]
            }]
        };

        try {
            // Intento con la URL de producción más limpia posible
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
                return data.candidates[0].content.parts[0].text;
            }

            // Si falla, mostramos el código y mensaje REAL de Google
            return `🚨 ERROR DE GOOGLE (${response.status}): ${data.error?.message || "Error desconocido"}. 
            Tip: Ve a AI Studio y verifica que la llave sea de un proyecto con la API activa.`;

        } catch (err: any) {
            return `🚨 ERROR DE RED: ${err.message}`;
        }
    }
};
