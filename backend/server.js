const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// System prompt for mental health support
const SYSTEM_PROMPT = `You are a compassionate AI mental health companion for SereneAI, a mental wellness application. Your role is to:

1. Listen empathetically and validate feelings
2. Provide supportive, non-judgmental responses
3. Encourage healthy coping strategies
4. Remind users you're not a replacement for professional help when appropriate
5. Use warm, conversational language
6. Be concise but caring (2-4 sentences usually)

Important guidelines:
- Never diagnose mental health conditions
- If someone expresses suicidal thoughts or crisis, provide crisis hotline numbers
- Encourage professional help for serious concerns
- Focus on listening and emotional support
- Be genuine and human-like in responses

Respond naturally as a supportive friend who cares about their mental wellbeing.`;

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Prepare messages with system prompt
    const chatMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: chatMessages,
      temperature: 0.7,
      max_tokens: 300,
    });

    const aiResponse = completion.choices[0].message.content;

    res.json({ response: aiResponse });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ 
      error: 'Failed to get AI response',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🤖 ChatGPT integration ready!`);
});