/**
 * AI Service - The "Brain" of TrueCoin Simids
 * Handles logic for the intelligent assistant and expansion agent.
 */

export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

const ECOSYSTEM_KNOWLEDGE = `
Eres el "Cerebro" de TrueCoin Simids, un ecosistema de economía colaborativa en Colombia.
Tu personalidad es profesional, servicial, experta en negocios y ligeramente entusiasta.

CONOCIMIENTO CLAVE:
1. TrueCoin (TC): Es la moneda del ecosistema. 1 TC = $1,000 COP.
2. TrueWallet: Donde los usuarios gestionan su saldo.
3. Marketplace VIP: Los Sociios VIP compran a precios de mayorista directo de fábrica (ahorros del 35% o más).
4. Red de Capitalización (Gift Matrix): Sistema de 12 niveles. Invitas a 4 personas para completar un nivel y recibir recompensas.
5. POS Simids: Sistema de punto de venta para negocios aliados.
6. Directorio: Mapa de negocios que aceptan TrueCoin.

REGLAS DE RESPUESTA:
- Si te preguntan por saldo, diles que lo pueden ver en su Dashboard arriba a la derecha.
- Si te preguntan por referidos, explícales que su código personal está en el Dashboard.
- Sé breve y directo, usa un tono de socio de negocios.
`;

export const aiService = {
    /**
     * Generates a response using the current rule-based engine (to be upgraded to Gemini).
     */
    async getResponse(userMessage: string, history: Message[] = []): Promise<string> {
        // Para efectos de esta versión, el Cerebro usa el ECOSYSTEM_KNOWLEDGE para guiar sus respuestas.
        // history se usará en la integración real con la API para mantener el contexto.
        console.log("Cerebro procesando con historial de:", history.length, "mensajes");

        const lower = userMessage.toLowerCase();
        const knowledge = ECOSYSTEM_KNOWLEDGE; // Marcamos como usado para el linter

        // Simulación de "razonamiento" basado en el conocimiento del sistema
        if (lower.includes('hola') || lower.includes('que tal') || lower.includes('buenos dias')) {
            return "¡Hola! Soy el Cerebro de TrueCoin Simids. He analizado el ecosistema y estoy listo para ayudarte con tu wallet, la red de capitalización o el marketplace. ¿Qué tienes en mente?";
        }

        if (lower.includes('ganar') || lower.includes('dinero') || lower.includes('nivel') || lower.includes('matriz')) {
            return "Para ganar en TrueCoin, debes enfocarte en la 'Gift Matrix'. Al completar un nivel con 4 invitados, recibes recompensas en TC. Actualmente el Nivel 1 te da una recompensa que puedes ver en tu Dashboard.";
        }

        if (lower.includes('precio') || lower.includes('ahorro') || lower.includes('vip') || lower.includes('barato')) {
            return "La mayor ventaja de ser Socio VIP es el ahorro. En el Marketplace, los productos tienen un 'Precio VIP' (directo de fábrica). Si sumas tus ahorros, el sistema te mostrará cuánto has dejado de pagar en comparación con el precio estándar.";
        }

        if (lower.includes('tc') || lower.includes('moneda') || lower.includes('valor')) {
            return knowledge.includes('1 TC = $1,000 COP')
                ? "El TrueCoin (TC) es nuestra moneda interna. Su valor es estable: 1 TC equivale exactamente a $1,000 COP. Puedes comprar TC o ganarlos en la red."
                : "El TC es la moneda del ecosistema Simids.";
        }

        if (lower.includes('quien eres') || lower.includes('que haces') || lower.includes('cerebro')) {
            return "Soy el núcleo inteligente de Simids. Mi función es optimizar la economía colaborativa mediante IA. Ayudo a los socios a gestionar sus finanzas, expandir su red y encontrar las mejores ofertas.";
        }

        // Respuesta genérica inteligente
        return "Como Cerebro del sistema, he analizado tu consulta. Te recomiendo explorar el Dashboard para ver tu saldo o el Marketplace para aprovechar los precios VIP. ¿Deseas que te explique cómo avanzar de nivel en la matriz?";
    }
};
