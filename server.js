const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || '';
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Simple In-Memory Cache
const cache = new Map();

// Robust JSON Extraction Helper
function extractJson(text) {
    try {
        // Try direct parse first
        return JSON.parse(text);
    } catch (e) {
        // Try to find JSON block in markdown or raw text
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                return JSON.parse(jsonMatch[0]);
            } catch (innerError) {
                console.error("Failed to parse extracted JSON block:", innerError.message);
            }
        }
        throw new Error("No valid JSON found in model response");
    }
}

async function generateWithGemini(modelName, prompt, retries = 2) {
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        if (error.status === 429 && retries > 0) {
            console.log(`Gemini Rate limit hit. Retrying... (${retries} left)`);
            await new Promise(r => setTimeout(r, 2000));
            return generateWithGemini(modelName, prompt, retries - 1);
        }
        throw error;
    }
}

async function generateWithGroq(prompt) {
    if (!GROQ_API_KEY) throw new Error("Groq API Key missing");
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Groq API Error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

app.post('/analyze', async (req, res) => {
    const { input } = req.body;
    
    if (cache.has(input)) {
        console.log("Serving from Cache!");
        return res.json(cache.get(input));
    }

    const prompt = `You are CodeMinds, an elite debugging assistant.
Analyze the following code/error and provide 5 perspectives.

USER INPUT:
"""
${input}
"""

FORMATTING RULES:
1. Explain Like I'm 5: Analogy required. Max 3 sentences.
2. Rubber Duck: First person ("I see..."). Max 4 sentences.
3. Senior Developer Review: Technical root cause and best practices.
4. Internet Persona: Sarcastic/Meme format or classic dev humor.
5. AI Fix Proposal: ONLY code snippet or command.

RETURN RAW JSON MATCHING THIS STRUCTURE:
{
  "Explain Like I'm 5": "",
  "Rubber Duck": "",
  "Senior Dev Review": "",
  "Internet Persona": "",
  "AI Fix Proposal": "",
  "complexityScore": "Easy/Medium/Hard"
}`;

    try {
        let finalData = null;

        // 1. Try Gemini Models First
        const geminiModels = ["gemini-2.0-flash", "gemini-1.5-flash"];
        for (const modelName of geminiModels) {
            try {
                if (!GEMINI_API_KEY) break;
                console.log(`Trying Gemini: ${modelName}`);
                const text = await generateWithGemini(modelName, prompt);
                console.log(`Raw Response from ${modelName}:`, text);
                finalData = extractJson(text);
                break;
            } catch (e) {
                console.warn(`Gemini (${modelName}) failed:`, e.message);
            }
        }

        // 2. Fallback to Groq (The "Never-Fail" Option)
        if (!finalData) {
            try {
                console.log("Gemini failed or skipped. Trying Groq...");
                const text = await generateWithGroq(prompt);
                console.log("Raw Response from Groq:", text);
                finalData = extractJson(text);
                console.log("Groq Success!");
            } catch (e) {
                console.error("Groq also failed:", e.message);
            }
        }

        if (finalData) {
            cache.set(input, finalData);
            return res.json(finalData);
        }

        // 3. Last Resort: Multi-Layer Mock Fallback
        res.json({
          "Explain Like I'm 5": "The robot brain is taking a nap. Try again in a minute!",
          "Rubber Duck": "I'm looking at the wires and... wait, I think I tripped over one. All APIs are currently unavailable.",
          "Senior Dev Review": "Service unavailable. Multiple upstream providers (Gemini, Groq) failed to respond or returned invalid data.",
          "Internet Persona": "Internal Server Error: This is fine. 🔥🐶🔥",
          "AI Fix Proposal": "// Check your network connection or API keys in .env",
          "complexityScore": "N/A"
        });

    } catch (err) {
        console.error("Analysis endpoint crashed:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend Server running on port ${PORT} [VERSION: ALIGNED_KEYS]`);
});
