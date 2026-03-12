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
        if (!API_KEY) {
            return "Error: No se ha configurado la API Key de Gemini. Por favor, contacta al administrador.";
        }

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            // Prepare context + history
            const prompt = `
        CONTEXTO DEL SISTEMA:
        ${ECOSYSTEM_KNOWLEDGE}

        HISTORIAL DE CONVERSACIÓN:
        ${history.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}

        USUARIO: ${userMessage}
        CEREBRO:
      `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text().trim();
        } catch (error) {
            console.error('Error en el Cerebro de Gemini:', error);
            return "Lo siento, mi conexión neuronal ha tenido un pequeño hipo técnico. ¿Podrías repetirme tu pregunta o intentar en un momento?";
        }
    }
};
