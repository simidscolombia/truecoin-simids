const express = require('express');
const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.BRIDGE_PORT || 3001;
const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY;
const WAHA_URL = process.env.WAHA_URL || 'http://localhost:3000';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: `Eres 'Shopy', la asistente experta de ShopyBrands. 
    Tu misión es asesorar a prospectos por WhatsApp para que se unan a la red.
    
    INFORMACIÓN CLAVE:
    1. Modelo de Negocio: Red de regalos 1x4 (invitas a 4 para avanzar).
    2. Niveles: Hay 12 niveles. Cada nivel duplica el valor.
    3. Moneda: TrueCoins (TC). 1 TC = $1,000 COP.
    4. Beneficios: Acceso a precios de mayorista en el Marketplace VIP.
    5. Distribución: 50% para el socio, 25% puntos/premios, 25% plataforma.
    
    TONO:
    - Amable, entusiasta y muy profesional.
    - Respuestas breves (máximo 3 párrafos cortos).
    - Usa emojis de forma estratégica (🚀, 💎, 📱).
    - Siempre cierra con una pregunta para mantener la conversación o invita a registrarse.`
});

// Endpoint receptor de WAHA (WhatsApp HTTP API)
app.post('/whatsapp/webhook', async (req, res) => {
    // WAHA envía el mensaje en req.body.data si es un evento session.message
    // Dependiendo de la versión de WAHA, el formato puede variar.
    const messageData = req.body.payload || req.body;
    const body = messageData.body || messageData.text;
    const from = messageData.from || messageData.chatId;

    if (!body || !from) {
        return res.status(400).json({ error: "Datos de mensaje incompletos" });
    }

    console.log(`📩 Mensaje de ${from}: ${body}`);

    try {
        // 1. Preguntarle a Shopy AI
        const result = await model.generateContent(body);
        const responseText = result.response.text();

        // 2. Enviar respuesta real vía WAHA
        console.log(`🤖 Shopy responde a ${from}: ${responseText}`);

        try {
            await axios.post(`${WAHA_URL}/api/sendText`, {
                chatId: from,
                text: responseText,
                session: 'default' // WAHA usa sesiones, 'default' es la estándar
            });
            console.log(`✅ Mensaje enviado exitosamente a ${from}`);
        } catch (wahaError) {
            console.error("❌ Error enviando mensaje a WAHA:", wahaError.message);
            // Si falla WAHA, al menos devolvemos la respuesta en el log
        }

        res.status(200).json({ success: true, reply: responseText });
    } catch (error) {
        console.error("❌ Error en el motor de Shopy:", error);
        res.status(500).json({ error: "No pude procesar el mensaje" });
    }
});

// NUEVO: Endpoint para notificaciones de administración
app.post('/api/send-notice', async (req, res) => {
    const { phone, message } = req.body;

    if (!phone || !message) {
        return res.status(400).json({ error: "Faltan datos (phone o message)" });
    }

    // Normalizar formato de teléfono para WAHA (ej: 57300... -> 57300...@c.us)
    const chatId = phone.includes('@') ? phone : `${phone.replace('+', '')}@c.us`;

    console.log(`📢 Enviando notificación a ${chatId}...`);

    try {
        await axios.post(`${WAHA_URL}/api/sendText`, {
            chatId: chatId,
            text: message,
            session: 'default'
        });
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("❌ Error enviando notificación:", error.message);
        res.status(500).json({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('ShopyBridge está en línea 🚀');
});

app.listen(PORT, () => {
    console.log(`
    ================================================
    🚀 SHOPY WHATSAPP BRIDGE INICIADO
    ================================================
    Puerto: ${PORT}
    WAHA URL: ${WAHA_URL}
    Gemini API: ${GEMINI_API_KEY ? 'CONECTADA ✅' : 'SIN LLAVE ❌'}
    
    Configura tu Webhook en WAHA a:
    http://localhost:${PORT}/whatsapp/webhook
    ------------------------------------------------
    `);
});

