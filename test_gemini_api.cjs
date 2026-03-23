require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
    console.log("Testing Gemini API Key...");
    try {
        const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Respond with the exact word 'SUCCESS'.");
        console.log("Gemini Response:", result.response.text());
    } catch (e) {
        console.error("Gemini Error:", e.message);
    }
}
test();
