const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || '';
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const cache = new Map();

function extractJson(text) {
    try {
        return JSON.parse(text);
    } catch (e) {
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

app.post('/api/analyze', async (req, res) => {
    const { input } = req.body;
    if (cache.has(input)) return res.json(cache.get(input));

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
        const geminiModels = ["gemini-2.0-flash", "gemini-1.5-flash"];
        for (const modelName of geminiModels) {
            try {
                if (!GEMINI_API_KEY) break;
                const text = await generateWithGemini(modelName, prompt);
                finalData = extractJson(text);
                break;
            } catch (e) {
                console.warn(`Gemini (${modelName}) failed:`, e.message);
            }
        }

        if (!finalData) {
            try {
                const text = await generateWithGroq(prompt);
                finalData = extractJson(text);
            } catch (e) {
                console.error("Groq fallback failed:", e.message);
            }
        }

        if (finalData) {
            cache.set(input, finalData);
            return res.json(finalData);
        }

        res.json({
          "Explain Like I'm 5": "The robot brain is taking a nap. Try again in a minute!",
          "Rubber Duck": "I'm looking at the wires and... wait, I think I tripped over one.",
          "Senior Dev Review": "Service unavailable. All upstream providers failed.",
          "Internet Persona": "Internal Server Error: This is fine. 🔥🐶🔥",
          "AI Fix Proposal": "// Check your API keys in Vercel settings",
          "complexityScore": "N/A"
        });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = app;
