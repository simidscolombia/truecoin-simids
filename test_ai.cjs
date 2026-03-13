const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

async function testAI() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hola, responde con 'OK' si funcionas.");
        console.log("AI Response:", result.response.text());
    } catch (e) {
        console.error("AI Error:", e.message);
    }
}

testAI();
