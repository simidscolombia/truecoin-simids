import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * AI Service - The "Brain" of TrueCoin Simids
 * Integrated with Google Gemini 1.5 Flash
 */

export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
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
    /**
     * Generates a response using Google Gemini 1.5 Flash.
     */
    async getResponse(userMessage: string, history: Message[] = []): Promise<string> {
        const maskedKey = API_KEY ? `${API_KEY.substring(0, 6)}...${API_KEY.substring(API_KEY.length - 4)}` : "MISSING";
        console.log(`CEREBRO: Intentando conexión con API Key: ${maskedKey}`);

        if (!API_KEY || API_KEY.length < 10) {
            console.error('CEREBRO ERROR: API Key no válida o ausente.');
            return "Error: No se ha detectado la llave de acceso (API Key) correctamente. Revisa los Environment Variables en Vercel.";
        }

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const systemPrompt = `[SYSTEM KNOWLEDGE]\n${ECOSYSTEM_KNOWLEDGE}\n\n[CONVERSATION HISTORY]\n`;
            const historyText = history.slice(-6).map(m => `${m.role === 'user' ? 'USER' : 'ASSISTANT'}: ${m.content}`).join('\n');
            const fullPrompt = `${systemPrompt}${historyText}\nUSER: ${userMessage}\nASSISTANT:`;

            const result = await model.generateContent(fullPrompt);
            const response = await result.response;
            const text = response.text();

            if (!text) throw new Error("Google devolvió una respuesta vacía.");

            return text.trim();
        } catch (error: any) {
            console.error('CRITICAL ERROR - CEREBRO DETAILED:', error);

            let userFriendlyError = "Hipo técnico neuronal.";

            if (error.message?.includes('fetch')) {
                userFriendlyError = "Error de red: Google ha rechazado la conexión. ¿Tienes algún bloqueador de anuncios o VPN activo?";
            } else if (error.message?.includes('API_KEY_INVALID')) {
                userFriendlyError = "La API Key configurada en Vercel es inválida.";
            } else if (error.message?.includes('429')) {
                userFriendlyError = "Límite de mensajes alcanzado. Espera un momento.";
            }

            return `Lo siento, el Cerebro dice: ${userFriendlyError} (Error: ${error.message || 'Unknown'})`;
        }
    }
};
