/**
 * AI Service - v1.5.8
 * Multi-Version Multi-Model Fallback
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

        const payload = {
            contents: [{
                parts: [{ text: `Eres el Cerebro de TrueCoin Simids. Responde breve en español.\n\nUsuario: ${userMessage}` }]
            }]
        };

        // Lista de combinaciones de emergencia [URL, Modelo]
        const attempts = [
            { ver: "v1beta", mod: "gemini-1.5-flash" },
            { ver: "v1", mod: "gemini-1.5-flash" },
            { ver: "v1", mod: "gemini-pro" },
            { ver: "v1beta", mod: "gemini-pro" }
        ];

        for (const attempt of attempts) {
            try {
                const url = `https://generativelanguage.googleapis.com/${attempt.ver}/models/${attempt.mod}:generateContent?key=${API_KEY}`;
                console.log(`CEREBRO: Probando ${attempt.mod} en ${attempt.ver}...`);

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
                console.warn(`Falló intento ${attempt.mod}`);
            }
        }

        return "🚨 ERROR FINAL: Google no reconoce ninguno de sus modelos con esta API Key. \n\nPOR FAVOR: \n1. Ve a https://aistudio.google.com/ \n2. Verifica que tu llave no tenga el mensaje 'API Key is restricted'. \n3. Crea una llave NUEVA e inténtalo de nuevo.";
    }
};
