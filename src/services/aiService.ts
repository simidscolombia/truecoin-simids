/**
 * AI Service - v1.8.2
 * Real-time Billing & Quota Diagnostics
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
            {
                role: 'user',
                parts: [{ text: `Responde en español.\nPregunta: ${userMessage}` }]
            }
        ];

        // Probamos el modelo más potente que vimos en tu lista
        const modelName = "gemini-2.0-flash";

        try {
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

            // REPORTE QUIRÚRGICO DEL ERROR
            const googleError = data.error?.message || "Error desconocido";
            const reason = data.error?.status || "Sin estado";

            return `🚨 DIAGNÓSTICO GOOGLE:
            - Mensaje: ${googleError}
            - Estado: ${reason}
            - Código: ${response.status}
            
            TIP: Si dice 'Quota exceeded' o 'Billing', es que el proyecto en Cloud Console no está vinculado a la cuenta de pagos.`;

        } catch (err: any) {
            return `🚨 ERROR DE RED: ${err.message}`;
        }
    }
};
