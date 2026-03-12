/**
 * AI Service - v1.8.0
 * Next-Gen Engine: Gemini 2.0 Flash
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

        // Contexto premium para el Cerebro 2.0
        const contents = [
            {
                role: 'user',
                parts: [{ text: "Eres el Cerebro de TrueCoin Simids, una IA de nueva generación. Eres profesional, experto en economía y muy servicial. Responde siempre en español." }]
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

        // Lista de modelos detectados en el escaneo V.I.P.
        const nextGenModels = [
            "gemini-2.0-flash",
            "gemini-flash-latest",
            "gemini-2.0-flash-lite",
            "gemini-pro-latest"
        ];

        for (const modelName of nextGenModels) {
            try {
                // Usamos v1beta ya que es donde estos modelos están habilitados según tu consola
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;

                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents })
                });

                const data = await response.json();
                if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
                    return data.candidates[0].content.parts[0].text;
                }
            } catch (e) {
                // Siguiente modelo...
            }
        }

        return "🚨 ERROR CRÍTICO: Aunque tienes modelos 2.0 y 3.0 activos, Google bloqueó la generación. Verifica que tu cuenta de Google Cloud no tenga restricciones de facturación.";
    }
};
