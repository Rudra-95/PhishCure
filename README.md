# *1. Project Overview*
PhishCure is a modern, full-stack React and Node.js artificial intelligence web application designed for verifying fake news, analyzing phishing attacks, and evaluating the credibility of digital content. The goal was to transform the AI-powered engine into a sophisticated SaaS application by combining enterprise-grade API logic with a premium glassmorphic UI.

# *2. Key Features Developed*
• Authentic AI Fact Checking Scoring: Integrates natively with the Groq Cloud AI Engine (llama-3.1-8b-instant model) to dynamically read inputted URLs or raw text. It processes and mathematically verifies claims in seconds, returning a 0-100 structured 'Safety Score' alongside generated reasoning.
• Dynamic 'Trusted Alternatives' Suggestions: Direct integration with the GNews API to automatically fetch matching verified news sources and recommend them if a user's scanned article is heavily biased or flagged.
• Robust Authentication System (MongoDB): A full custom backend Express REST API logic managing `/login` and `/forgot-password` flow securely in MongoDB schemas using standard credentials.
• Premium Glassmorphism UI: Highly specialized and responsive React CSS modules extending standard elements into an immersive deep-purple UI. Incorporates interactive animated score charts, sliding layouts, seamless route navigation, and glowing feedback boxes.

# *3. Tech Stack & Dependencies Used*
Frontend:
 - React Router DOM (for elegant page switches)
 - Vite Environment
 - Custom 'Outfit' Google Font mappings

# *Backend:*
 - Node.js & Express
 - MongoDB (Mongoose models) for Auth and local data viewing in MongoDB Compass
 - Groq SDK (AI engine execution)
 - Axios (REST querying for APIs)
 - DotEnv (Cred security)
