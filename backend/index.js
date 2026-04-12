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
                     aiDetails = JSON.parse(response.choices[0].message.content);
                }
            } catch (err) {
                console.error("Groq Error:", err);
            }
        }

        let trustedAlternatives = [];
        if (process.env.GNEWS_API_KEY && !process.env.GNEWS_API_KEY.includes('your_gnews_api_key_here')) {
            try {
                // simple search term extraction from value
                const query = type === 'url' ? 'latest news' : value.substring(0, 50).replace(/[^a-zA-Z0-9 ]/g, " ");
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

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch(err => console.log(err));