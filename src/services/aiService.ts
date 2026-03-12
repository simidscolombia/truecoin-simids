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
        if (!API_KEY || API_KEY === "") {
            console.error('CEREBRO: Missing Gemini API Key in environment variables.');
            return "Error: No se ha detectado la llave de acceso (API Key). Por favor, reinicia el servidor o revisa el archivo .env.";
        }

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            // Create a structured prompt that separates system knowledge from history
            const systemPrompt = `[SYSTEM KNOWLEDGE]\n${ECOSYSTEM_KNOWLEDGE}\n\n[CONVERSATION HISTORY]\n`;
            const historyText = history.slice(-6).map(m => `${m.role === 'user' ? 'USER' : 'ASSISTANT'}: ${m.content}`).join('\n');
            const fullPrompt = `${systemPrompt}${historyText}\nUSER: ${userMessage}\nASSISTANT:`;

            const result = await model.generateContent(fullPrompt);
            const response = await result.response;
            const text = response.text();

            if (!text) throw new Error("Empty response from Gemini");

            return text.trim();
        } catch (error: any) {
            console.error('CRITICAL ERROR - CEREBRO:', error);

            // Helpful error messages for the user/dev
            if (error.message?.includes('API_KEY_INVALID')) {
                return "Error: La API Key de Gemini no es válida. Por favor, revísala en Google AI Studio.";
            }
            if (error.message?.includes('429')) {
                return "Parece que estoy procesando muchas neuronas a la vez. Por favor, espera un minuto e intenta de nuevo.";
            }

            return "Lo siento, mi conexión neuronal ha tenido un pequeño hipo técnico. (Error: " + (error.message || 'Unknown') + ")";
        }
    }
};
