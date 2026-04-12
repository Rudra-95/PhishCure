require('dotenv').config();
const Groq = require('groq-sdk');

async function test() {
    try {
        console.log("Key:", process.env.GROQ_API_KEY ? "Loaded" : "Missing");
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const response = await groq.chat.completions.create({
            messages: [
                { role: 'user', content: 'Respond with JSON {"test": 123}' }
            ],
            model: 'llama3-8b-8192',
            response_format: { type: "json_object" }
        });
        console.log("Success:", response.choices[0].message.content);
    } catch(e) {
        console.error("Error:", e);
    }
}
test();
