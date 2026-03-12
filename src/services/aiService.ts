/**
 * AI Service - v1.8.5
 * Engine: Next-Gen Only (Gemini 2.0 & Latest Flash)
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

        // Contexto premium de ShopyBrands
        const contents = [
            ...history.slice(-4).map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.content }]
            })),
            {
                role: 'user',
                parts: [{
                    text: `Actúa como 'Shopy', el Coach Maestro de ShopyBrands.
                REGLAS DE ORO:
                1. La moneda son TrueCoins (TC). $1,000 COP = 1 TC.
                2. Red de Ventas: 2%, 2%, 2% y 4% (hasta nivel 4).
                3. Red de Regalos: 1x4 hasta nivel 12. Reparto: 25% Puntos, 25% Plataforma, 50% Reinversión.
                4. Nivel 12 tiene Reinicio Automático (Ciclo Infinito).
                5. Meta: Completar nivel 1 en 1 semana (Emblema Pionero Veloz).
                6. Sé motivador, profesional y usa un tono de socio estratégico.
                
                Pregunta del usuario: ${userMessage}`
                }]
            }
        ];

        // SOLO modelos que vimos en tu lista activa (Step 1739)
        const activeModels = [
            { ver: "v1beta", mod: "gemini-2.0-flash" },
            { ver: "v1beta", mod: "gemini-flash-latest" },
            { ver: "v1beta", mod: "gemini-pro-latest" }
        ];

        let detail = "";

        for (const config of activeModels) {
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
                detail = data.error?.message || "Error desconocido";
            } catch (e) {
                // Siguiente modelo...
            }
        }

        return `🚨 ERROR: Tu cuenta tiene modelos 2.0 pero Google rechaza la petición. MOTIVO: ${detail}.`;
    }
};
