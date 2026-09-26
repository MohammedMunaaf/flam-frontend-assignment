import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: 'Prompt is required and must be non-empty.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY is not configured on the server. Please add it to your .env file.'
    });
  }

  try {
    const ai = new GoogleGenerativeAI(apiKey);
    const model = ai.getGenerativeModel({
      model: 'gemini-3.1-flash-lite',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7
      }
    });

    const systemPrompt = `You are a travel itinerary planner. Generate a realistic day-by-day travel itinerary based on the user request.
      Return ONLY valid JSON matching this exact structure, with no markdown formatting or prose:
      {
        "title": "Short descriptive title for the trip",
        "summary": "Brief 1-2 sentence overview of the trip experience",
        "days": [
          {
            "day": 1,
            "title": "Area or theme for this day",
            "stops": [
              {
                "name": "Attraction or activity name",
                "description": "Concise 1-2 sentence description of what to do or see",
                "duration": "Estimated duration (e.g. 1.5 hours, 2 hours)"
              }
            ]
          }
        ]
      }

      User request: ${prompt.trim()}`;

    const result = await model.generateContent(systemPrompt);
    const responseText = result.response.text();

    if (!responseText || !responseText.trim()) {
      return res.status(502).json({ error: 'Received an empty response from AI model.' });
    }

    const cleanedText = responseText
      .replace(/^```json\s*/i, '')
      .replace(/```\s*$/, '')
      .trim();

    const parsedData = JSON.parse(cleanedText);
    return res.json(parsedData);
  } catch (error) {
    console.error('Gemini generate error:', error);
    return res.status(500).json({
      error: 'Failed to generate itinerary right now. Please try again.'
    });
  }
});

app.post('/api/refine', async (req, res) => {
  const { currentItinerary, instruction } = req.body;

  if (!currentItinerary || !Array.isArray(currentItinerary.days)) {
    return res.status(400).json({ error: 'Valid existing itinerary is required for refinement.' });
  }

  if (!instruction || typeof instruction !== 'string' || !instruction.trim()) {
    return res.status(400).json({ error: 'Refinement instruction is required.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY is not configured on the server. Please add it to your .env file.'
    });
  }

  try {
    const ai = new GoogleGenerativeAI(apiKey);
    const model = ai.getGenerativeModel({
      model: 'gemini-3.1-flash-lite',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7
      }
    });

    const systemPrompt = `You are a travel itinerary planner. Refine and modify the provided trip itinerary according to the user's refinement instructions.
      Keep all unmodified days, stops, and details intact unless specifically requested to change, remove, or replace them.
      Return ONLY valid JSON matching this exact structure, with no markdown formatting or prose:
      {
        "title": "Short descriptive title for the trip",
        "summary": "Brief 1-2 sentence overview of the trip experience",
        "days": [
          {
            "day": 1,
            "title": "Area or theme for this day",
            "stops": [
              {
                "name": "Attraction or activity name",
                "description": "Concise 1-2 sentence description of what to do or see",
                "duration": "Estimated duration (e.g. 1.5 hours, 2 hours)"
              }
            ]
          }
        ]
      }

      Current itinerary:
      ${JSON.stringify(currentItinerary, null, 2)}

      Refinement instruction:
      ${instruction.trim()}`;

    const result = await model.generateContent(systemPrompt);
    const responseText = result.response.text();

    if (!responseText || !responseText.trim()) {
      return res.status(502).json({ error: 'Received an empty response from AI model.' });
    }

    const cleanedText = responseText
      .replace(/^```json\s*/i, '')
      .replace(/```\s*$/, '')
      .trim();

    const parsedData = JSON.parse(cleanedText);
    return res.json(parsedData);
  } catch (error) {
    console.error('Gemini refine error:', error);

    return res.status(500).json({
      error: 'Failed to refine itinerary right now. Please try again.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
