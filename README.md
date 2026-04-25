# *🧠 1. Project Overview*
PhishCure is a full-stack, AI-driven cybersecurity and content verification platform built using React and Node.js. It is designed to detect phishing threats, analyze fake news, and assess the credibility of digital content in real time.
The system combines intelligent backend processing with a modern, glassmorphic frontend to deliver a SaaS-grade user experience. By integrating advanced AI models with scalable API architecture, PhishCure transforms raw data into actionable trust insights, enabling users to make informed decisions in an increasingly deceptive digital landscape.

# *⚡2. Key Features Developed*
 🔍 AI-Powered Fact Verification Engine
 • Seamless integration with the Groq Cloud AI Engine using the LLaMA 3.1 (8B Instant) model
 • Analyzes URLs or raw text inputs in real time
 • Generates a structured 0–100 Safety Score with explainable reasoning
 • Designed for fast inference and scalable AI-driven validation
 🌐 Intelligent Trusted Source Recommendations
 • Integrated with the GNews API to fetch reliable, real-time news sources
 • Automatically suggests credible alternatives when content is flagged as biased or potentially misleading
 • Enhances user trust through cross-verification mechanisms
 🛡️ Zero-Click Threat Interception Extension
 • Developed a browser extension that performs real-time DOM scanning using MutationObserver
 • Detects suspicious links via heuristic pre-filtering (e.g., mismatched URLs, unsafe domains)
 • Implements mid-air click interception to halt navigation before execution
 • Integrates backend AI validation for deep phishing analysis before allowing access
 🔐 Secure Authentication System
 • Custom-built REST API using Node.js + Express
 • Implements secure login and password recovery workflows
 • Managed via MongoDB (Mongoose schemas) with structured user data handling
 • Designed with scalability and security best practices
 🎨 Premium Glassmorphism UI/UX
 • Built using React with modular CSS and Vite environment
 • Features a modern glassmorphic design system with deep-theme aesthetics
 • Includes:
    • Interactive animated score visualizations
    • Smooth transitions and route handling
    • Responsive layouts and intuitive navigation
    • Real-time feedback components for user interaction

# *🛠️ 3. Tech Stack & Dependencies*
 💻 Frontend
 • React.js (with Vite)
 • React Router DOM (client-side routing)
 • CSS Modules (custom glassmorphism styling)
 • Google Fonts (Outfit typography)
 ⚙️ Backend
 • Node.js & Express.js (REST API architecture)
 • MongoDB with Mongoose (database & schema management)
 • Groq SDK (AI inference engine integration)
 • Axios (API communication layer)
 • DotEnv (environment variable management)

# *🎯 Vision*
PhishCure aims to evolve into a comprehensive AI-powered security layer for the web, enabling users to proactively detect threats, verify information authenticity, and navigate the internet with confidence.
