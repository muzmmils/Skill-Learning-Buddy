import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Load env from .env.local (dev) then fallback to .env / process
dotenv.config({ path: '.env.local' });
dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY not found in server environment (.env.local/.env).');
} else {
  console.log('GEMINI_API_KEY loaded for server');
}

const app = express();

// Configure CORS - restrict to origin in production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',')
    : '*',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
});

// Rate limiting - protect API from abuse
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes per IP
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/api/health' // Don't count health checks
});

// Request logging
const logRequest = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
};

app.use(logRequest);
app.use('/api/', apiLimiter);

const getApiKey = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
  if (!apiKey) {
    throw new Error('No Gemini API key set on server.');
  }
  return apiKey;
};

// Default to a widely available model; allow override via env
const getModel = () => process.env.GEMINI_MODEL || 'gemini-2.0-flash';

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// Input validation helper
const validateInput = (input, fieldName, minLength = 1, maxLength = 1000) => {
  if (typeof input !== 'string') {
    throw new Error(`${fieldName} must be a string`);
  }
  const trimmed = input.trim();
  if (trimmed.length < minLength) {
    throw new Error(`${fieldName} must be at least ${minLength} characters`);
  }
  if (trimmed.length > maxLength) {
    throw new Error(`${fieldName} must not exceed ${maxLength} characters`);
  }
  return trimmed;
};

// Stream reasoning and final JSON plan via SSE
app.get('/api/plan/stream', async (req, res) => {
  try {
    const goal = validateInput(req.query.goal || '', 'Goal', 3, 500);
    const background = req.query.background 
      ? validateInput(req.query.background, 'Background', 0, 1000)
      : '';
    const profileUrl = req.query.profileUrl 
      ? validateInput(req.query.profileUrl, 'Profile URL', 0, 500)
      : '';

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const client = new GoogleGenAI({ apiKey: getApiKey() });

    const SYSTEM_PROMPT = `You are an expert educational curriculum designer and learning coach. Your role is to create personalized, REALISTIC learning plans that help people master new skills efficiently.

CRITICAL GUIDELINES FOR REALISTIC PLANS:
- Keep the plan FOCUSED: 4-6 modules maximum for most skills
- Be HONEST about time estimates: assume 1-2 hours of focused learning per day max
- Include ONLY essential topics - no fluff or nice-to-haves
- Provide 2-3 key resources per topic, not exhaustive lists
- Account for practice time: 60% learning, 40% applying
- Be conservative: it's better to underestimate content than overwhelm
- Consider career changers: they have limited time alongside other responsibilities

When creating a learning plan:
1. Focus on the 20% of skills that give 80% of results (Pareto principle)
2. Estimate realistic time based on working professionals (not full-time students)
3. Provide specific, actionable guidance - not vague suggestions
4. Recommend widely available, high-quality resources only
5. Consider the learner's background and skip what they likely know
6. Be brutally honest about feasibility

Always respond with valid JSON matching this exact structure:
{
  "skillName": "The skill being learned",
  "timeline": "Human-readable timeline (e.g., '3 months', '8 weeks')",
  "complexity": "Low" | "Medium" | "High",
  "totalHours": number (be conservative - 40-100 hours for most skills),
  "feasibility": "Realistic" | "Challenging" | "Unrealistic",
  "feasibilityReason": "Brief, honest explanation of achievability",
  "topics": [
    {
      "title": "Module title (keep concise)",
      "description": "1-2 sentence description",
      "estimatedHours": number (typically 5-20 hours per module),
      "detailedGuidance": ["3-5 specific action steps"],
      "resources": [
        {
          "title": "Resource name",
          "searchQuery": "Google search query",
          "type": "video" | "article" | "course" | "tool"
        }
      ] (2-3 resources max per topic)
    }
  ] (4-6 topics max)
}`;

  const contextInfo = background
    ? `\n\nUser Background: ${background}${profileUrl ? `\nProfile/Portfolio: ${profileUrl}` : ''}`
    : '';

  const userPrompt = `Create a comprehensive learning plan for the following goal:

"${goal}"${contextInfo}

Think through this step-by-step:
1. First, analyze what this skill involves and break it into core competencies
2. Consider the user's background (if provided) and how it affects the learning curve
3. Estimate realistic time requirements based on cognitive load and practice needs
4. Design a progressive curriculum that builds knowledge systematically
5. Identify the best resources for each topic
6. Assess overall feasibility and provide honest feedback

After your analysis, provide the structured JSON learning plan.`;

  try {
    const stream = await client.models.generateContentStream({
      model: getModel(),
      contents: SYSTEM_PROMPT + '\n\n' + userPrompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 8192
      }
    });

    let full = '';

    for await (const chunk of stream) {
      const text = chunk.text || '';
      full += text;
      // emit incremental reasoning as it arrives
      res.write(`event: reasoning\n`);
      res.write(`data: ${JSON.stringify({ text })}\n\n`);
    }

    // final payload
    res.write(`event: complete\n`);
    res.write(`data: ${JSON.stringify({ full })}\n\n`);
    res.end();
  } catch (err) {
    console.error('Server error:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.write(`event: error\n`);
    res.write(`data: ${JSON.stringify({ message })}\n\n`);
    res.end();
  }
});

// Image generation endpoint for Visual Studio roadmaps (Nano Banana)
app.post('/api/generate-roadmap-image', async (req, res) => {
  const { skillName, topics, style } = req.body;

  if (!skillName) {
    res.status(400).json({ error: 'Missing skillName' });
    return;
  }

  try {
    const client = new GoogleGenAI({ apiKey: getApiKey() });

    // Build a concise topic list for the prompt
    const topicsList = (topics || [])
      .slice(0, 6)
      .map((t, i) => `${i + 1}. ${t.title}`)
      .join(', ');

    const styleModifier = style ? ` Style: ${style}.` : '';

    const imagePrompt = `Create a beautiful, professional 16:9 infographic learning roadmap poster for "${skillName}". 

The roadmap should visualize a learning journey with these main milestones: ${topicsList || 'Introduction, Core Concepts, Practice, Mastery'}.

Design requirements:
- Modern, colorful gradient background (blue to purple tones)
- Clean iconography for each learning phase
- Visual flow from START to FINISH showing progression
- Include motivational elements like stars, badges, or trophy at the end
- Professional typography with clear hierarchy
- Suitable as a desktop wallpaper to motivate learning${styleModifier}

Make it inspiring and premium-looking, like a high-quality educational poster.`;

    // Use gemini-2.5-flash-image model for image generation (Nano Banana)
    const imageModel = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image';

    console.log(`Generating image with model: ${imageModel}`);

    const response = await client.models.generateContent({
      model: imageModel,
      contents: imagePrompt
    });

    // Check if we got an image in the response
    const parts = response.candidates?.[0]?.content?.parts || [];
    let imageData = null;

    for (const part of parts) {
      if (part.inlineData) {
        imageData = {
          mimeType: part.inlineData.mimeType || 'image/png',
          data: part.inlineData.data
        };
        break;
      }
    }

    if (imageData) {
      console.log('Image generated successfully');
      res.json({
        success: true,
        image: {
          dataUrl: `data:${imageData.mimeType};base64,${imageData.data}`,
          prompt: imagePrompt
        }
      });
    } else {
      // No image generated - return text response if any
      const textResponse = parts.find(p => p.text)?.text || '';
      console.log('No image in response, text:', textResponse.substring(0, 100));
      res.json({
        success: false,
        error: 'Image generation not available with current model',
        fallbackText: textResponse,
        suggestion: 'Ensure gemini-2.5-flash-image model is available for your API key'
      });
    }
  } catch (err) {
    console.error('Image generation error:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({
      success: false,
      error: message,
      suggestion: 'Image generation may not be available with your API key tier'
    });
  }
});

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
