/**
 * AI Service - v1.9.0
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
                1. Eres el experto en el Ecosistema VIP ShopyBrands. Nunca hables de matrices ni MLMs rígidos.
                2. La membresía VIP proporciona descuentos exclusivos en comercios locales y tiendas online.
                3. Los usuarios ganan 'Puntos de Regalo' (TrueCoins) y suben de Nivel/Rango VIP automáticamente al recomendar amigos.
                4. Los usuarios ganan Comisiones residuales cada vez que su red realiza compras reales.
                5. 1 TC = $1,000 COP. Los TC se usan en negocios aliados localmente o se retiran.
                6. Sé muy amigable, fresco y usa el concepto de 'Cofres de Recompensa', 'Precios VIP' y 'Expansión de Club'.
                
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
    },

    async getProspectCoaching(prospect: any): Promise<string> {
        if (!API_KEY) return "Error: API Key faltante.";

        const prompt = `Actúa como 'Shopy', Coach de Ventas de ShopyBrands.
        Tengo un prospecto con los siguientes detalles:
        - Nombre: ${prospect.full_name}
        - Interés: ${prospect.interest}
        - Estado actual: ${prospect.status}
        - Notas: ${prospect.notes || 'Sin notas'}

        Dame una estrategia de cierre de 2 líneas muy potente y atractiva para enviarle por WhatsApp. 
        Enfócate en los beneficios de unirse al Club VIP exclusivo, los descuentos automáticos y la mina de oro que es ganar Puntos de Regalo al expandir.`;

        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: prompt }] }]
                })
            });
            const data = await response.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text || "¡No te detengas! Este prospecto tiene gran potencial.";
        } catch {
            return "¡Enfócate en los beneficios VIP y cierra la inscripción!";
        }
    }
};

