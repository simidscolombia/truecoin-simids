import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * AI Service - The "Brain" of TrueCoin Simids
 * v1.5.1 - Compatibility Patch for Google API v1
 */

export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

// Clean the API Key to avoid hidden spaces
const API_KEY = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
// Force v1 API version for better stability in Latin America
const genAI = new GoogleGenerativeAI(API_KEY);

const ECOSYSTEM_KNOWLEDGE = `
Eres el "Cerebro" de TrueCoin Simids, un ecosistema de economía colaborativa en Colombia.
Tu personalidad es profesional, servicial, experta en negocios y ligeramente entusiasta.

CONOCIMIENTO CLAVE:
1. TrueCoin (TC): Es la moneda del ecosistema. 1 TC = $1,000 COP.
2. TrueWallet: Donde los usuarios gestionan su saldo.
3. Marketplace VIP: Los Socios VIP compran a precios de mayorista directo de fábrica (ahorros del 35% o más).
4. Red de Capitalización (Gift Matrix): Sistema de 12 niveles. Invitas a 4 personas para completar un nivel y recibir recompensas.
5. POS Simids: Sistema de punto de venta para negocios aliados.
6. Directorio: Mapa de negocios que aceptan TrueCoin.

REGLAS DE RESPUESTA:
- Responde siempre en español.
- Si te preguntan por saldo, diles que lo pueden ver en su Dashboard arriba a la derecha.
- Si te preguntan por referidos, explícales que su código personal está en el Dashboard.
- Sé breve y directo, usa un tono de socio de negocios.
- No inventes datos que no estén aquí. Si no sabes algo, redirige al usuario al Dashboard o al soporte humano.
`;

export const aiService = {
    async getResponse(userMessage: string, history: Message[] = []): Promise<string> {
        if (!API_KEY || API_KEY.length < 10) {
            return "Error: No se ha detectado la llave de acceso (API Key) correctamente en Vercel.";
        }

        const systemPrompt = `[KNOWLEDGE]\n${ECOSYSTEM_KNOWLEDGE}\n\n[HISTORY]\n`;
        const historyText = history.slice(-6).map(m => `${m.role === 'user' ? 'USER' : 'ASSISTANT'}: ${m.content}`).join('\n');
        const fullPrompt = `${systemPrompt}${historyText}\nUSER: ${userMessage}\nASSISTANT:`;

        // Attempt chain: Flash v1 -> Pro v1 -> Pro v1beta
        const modelAttempts = [
            { name: "gemini-1.5-flash", version: "v1" },
            { name: "gemini-1.5-pro", version: "v1" },
            { name: "gemini-pro", version: "v1" }
        ];

        for (const attempt of modelAttempts) {
            try {
                console.log(`CEREBRO: Intentando con ${attempt.name} (${attempt.version})...`);
                const model = genAI.getGenerativeModel({ model: attempt.name }, { apiVersion: attempt.version as any });
                const result = await model.generateContent(fullPrompt);
                const response = await result.response;
                const text = response.text();
                if (text) return text.trim();
            } catch (err: any) {
                console.warn(`CEREBRO: Falló ${attempt.name}: ${err.message}`);
                // Continue to next attempt
            }
        }

        return "Lo siento, el Cerebro no puede conectar con los servidores de Google ahora mismo. Por favor, verifica que tu API Key en Vercel esté activa y tenga saldo/cuota disponible en Google AI Studio.";
    }
};
