# 🧠 CodeMinds: One Code. Five Minds. Total Clarity.

CodeMinds is an AI-powered code analysis platform built for **OpenSprint 2026**. It transforms the lonely act of debugging into a high-performance brainstorming session by "mirroring" your code through five distinct artificial minds.

## 💡 The Idea Behind CodeMinds

Most debugging tools are clinical and boring. CodeMinds changes the game by giving you a 360-degree view of your logic through professional, educational, and even humorous perspectives:

1.  **The Translator (ELI5)**: Breaks down complex blocks into simple analogies.
2.  **The Echo (Rubber Duck)**: Walks you through your own logic in the first person to spot the "Aha!" moment.
3.  **The Architect (Senior Dev)**: Provides a technical review focusing on scalability and best practices.
4.  **The Roast (Internet Persona)**: Lightens the mood with a sarcastic, meme-filled take on your mistakes.
5.  **The Specialist (AI Fix)**: Provides a refined code fix ready for copy-pasting.

---

## 🚀 Quick Start (Local Setup)

To run the project locally, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/saishree19-shet/CodeMinds
cd CodeMinds
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory and add your API keys:
```env
REACT_APP_GEMINI_API_KEY="your_gemini_api_key"
GROQ_API_KEY="your_groq_api_key"
```

### 4. Run the Project
You need to run **both** the frontend and the backend server.

**Start the Backend Server (Terminal 1):**
```bash
node server.js
```

**Start the Frontend (Terminal 2):**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express
- **AI Models**: Google Gemini Pro, Groq (Llama 3) - with automatic fallback retry logic!

## 🧪 Testing
Use the provided `test-api.js` to verify the backend independently:
```bash
node test-api.js
```

---
Built with ❤️ for **OpenSprint 2026**
