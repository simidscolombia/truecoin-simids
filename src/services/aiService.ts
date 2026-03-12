/**
 * AI Service - v1.6.3
 * Deep Diagnostics Mode - REST API
 */

export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

const API_KEY = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();

export const aiService = {
    async getResponse(userMessage: string, history: Message[] = []): Promise<string> {
        if (!API_KEY || API_KEY.length < 10) {
            return "Error: No hay API Key válida.";
        }

        // Simplificamos al máximo el mensaje para evitar errores de formato
        const contents = [
            {
                role: 'user',
                parts: [{ text: `Responde en español de forma breve.\nPregunta: ${userMessage}` }]
            }
        ];

        try {
            // INTENTO 1: v1beta (El más común para Flash)
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents })
            });

            const data = await response.json();

            if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
                return data.candidates[0].content.parts[0].text;
            }

            // INTENTO 2: v1 estable (Para cuentas con facturación activa)
            const urlV1 = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
            const responseV1 = await fetch(urlV1, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents })
            });

            const dataV1 = await responseV1.json();
            if (responseV1.ok && dataV1.candidates?.[0]?.content?.parts?.[0]?.text) {
                return dataV1.candidates[0].content.parts[0].text;
            }

            // REPORTE DE ERROR FINAL si nada funciona
            const finalError = dataV1.error?.message || data.error?.message || "Error Desconocido";
            const statusCode = responseV1.status || response.status;

            return `🚨 ERROR (${statusCode}): ${finalError}. 
            
            TIP: Verifica en tu consola de Google que la opción 'Restricciones de API' esté en 'No restringir clave' o que la 'Generative Language API' esté realmente Habilitada en la Biblioteca.`;

        } catch (err: any) {
            return `🚨 ERROR DE RED: ${err.message}`;
        }
    }
};
