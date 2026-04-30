require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

const Groq = require('groq-sdk');
const axios = require('axios');

app.post("/analyze", async (req, res) => {
    const { type, value } = req.body;

    console.log("Received analyze request:", type, value);

    try {
        let aiDetails = {
            score: 50,
            verdict: "Uncertain",
            summary: "AI connection failed or token missing. Could not analyze.",
            sources: [],
            details: []
        };

        if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim().startsWith('gsk_')) {
            try {
                const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
                
                const prompt = `Analyze this ${type} for potential fake news, bias, or phishing. 
                Value: "${value}". 
                Respond strictly with a valid JSON object matching this schema:
                {
                    "score": number (0-100, where 100 is completely safe/true, 0 is definitively fake/phishing),
                    "verdict": string (e.g., "Safe", "Highly Suspicious", "Fake News", "Verified"),
                    "summary": string (a 2-3 sentence AI reasoning for this score),
                    "details": [ { "title": string, "description": string } ] (at least 2 details about structure or credibility),
                    "sources": [ { "name": string, "url": string, "status": "Verified" | "Suspicious" } ] (mock sources the text claims to be from, if any)
                }`;

                const response = await groq.chat.completions.create({
                    messages: [
                        { role: 'user', content: prompt }
                    ],
                    model: 'llama-3.1-8b-instant',
                    response_format: { type: "json_object" }
                });

                if (response.choices[0]?.message?.content) {
                     let content = response.choices[0].message.content;
                     content = content.replace(/```json/gi, '').replace(/```/g, '').trim();
                     aiDetails = JSON.parse(content);
                }
            } catch (err) {
                console.error("Groq Error:", err);
                // Expose the actual error message to the user instead of generic failure
                aiDetails.summary = `Groq AI Error: ${err.message || 'Rate limit or connection issue.'}`;
            }
        } else {
            aiDetails.summary = "Groq API Key is missing or invalid on the server.";
        }

        let trustedAlternatives = [];
        if (process.env.GNEWS_API_KEY && !process.env.GNEWS_API_KEY.includes('your_gnews_api_key_here')) {
            try {
                let query = "latest news";
                if (type === 'url') {
                    try {
                        const urlObj = new URL(value.startsWith('http') ? value : 'http://' + value);
                        query = urlObj.hostname.replace('www.', '').split('.')[0];
                        if (urlObj.pathname.length > 10 && urlObj.pathname !== '/') {
                            query = urlObj.pathname.replace(/[-_/]/g, ' ').trim();
                        }
                    } catch (e) {
                        query = value.substring(0, 50).replace(/[^a-zA-Z0-9 ]/g, " ").trim();
                    }
                } else {
                    query = value.substring(0, 50).replace(/[^a-zA-Z0-9 ]/g, " ").trim();
                }
                const gnewsUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=us&max=3&apikey=${process.env.GNEWS_API_KEY}`;
                
                const gnewsRes = await axios.get(gnewsUrl);
                if (gnewsRes.data && gnewsRes.data.articles) {
                    trustedAlternatives = gnewsRes.data.articles.map(art => ({
                        name: art.source.name,
                        url: art.url,
                        reason: art.title
                    }));
                }
            } catch (err) {
                console.error("GNews Error:", err);
            }
        } else {
             // Mock data if no KEY provided to show UI
             trustedAlternatives = [
                { name: "Reuters Top News", url: "https://reuters.com", reason: "Standard baseline trusted source." },
                { name: "BBC News", url: "https://bbc.com", reason: "Verified international news counterpart." }
             ];
        }

        res.json({
            ...aiDetails,
            trusted_alternatives: trustedAlternatives
        });

    } catch(globalErr) {
        console.error(globalErr);
        res.status(500).json({ message: "Server error during analysis" });
    }
});

console.log("MONGO_URI:", process.env.MONGO_URI);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
})
.catch(err => {
    console.log("CRITICAL MONGODB ERROR: Cannot connect to DB.");
    console.log("Ensure your IP is whitelisted on MongoDB Atlas: https://www.mongodb.com/docs/atlas/security-whitelist/");
    console.error(err);
});
