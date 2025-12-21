# 🎓 Skill Learning Buddy

A React-based AI assistant designed to help you master new skills, powered by Google's Gemini API.

## 🚀 Overview

Skill Learning Buddy is an interactive application that acts as your personal tutor. Whether you want to learn a new programming language, a musical instrument, or a soft skill, this AI companion helps structure your learning path, answer questions, and track progress.

Built with:
- **React 19** (via Vite)
- **TypeScript**
- **Express.js** (Backend API)
- **Google Generative AI SDK** (`@google/genai`)

## ✨ Features

- **Learning Plan Generation**: AI creates personalized learning plans based on your goals
- **Streaming Responses**: Real-time reasoning and plan generation using Server-Sent Events
- **Time Estimates**: Realistic hour and timeline estimates for skill acquisition
- **Modern UI**: Clean and responsive interface built with React

## 🛠️ Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure API Key
Create `.env.local` in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash
```

Get your free API key from [Google AI Studio](https://aistudio.google.com/app/apikeys).

### 3. Start Development Server
```bash
npm run dev
```

This runs both the React frontend (port 3000) and Express backend (port 8787) concurrently.

- Frontend: http://localhost:3000
- Backend API: http://localhost:8787

## 🚀 Production Deployment

This app is designed to be deployed on **Render** (backend) + **Netlify** (frontend).

### Backend Deployment (Render)

1. Push code to GitHub
2. Connect repository to [Render](https://render.com)
3. Select the `render.yaml` configuration
4. Add environment variables:
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `NODE_ENV`: Set to `production`

The API will be available at `https://your-app-name.onrender.com`

### Frontend Deployment (Netlify)

1. Connect GitHub repository to [Netlify](https://app.netlify.com)
2. Deploy settings should auto-detect the config from `netlify.toml`
3. Add environment variable:
   - `VITE_API_URL`: Set to your Render backend URL (e.g., `https://your-app-name.onrender.com`)

### Security Best Practices

✅ API keys are server-side only (never exposed to frontend)
✅ Rate limiting enabled (100 requests per 15 minutes per IP)
✅ Input validation on all endpoints
✅ Security headers configured (X-Content-Type-Options, X-Frame-Options, CSP)
✅ CORS restricted to your domain in production
✅ Error boundary for graceful error handling

### Monitoring

- Health check endpoint: `/api/health`
- Logs available in Render/Netlify dashboards
- Set up error tracking (e.g., Sentry) for production

For more details, see [PRODUCTION_READINESS.md](./PRODUCTION_READINESS.md)

## 📋 Environment Variables

See `.env.example` for all available configuration options.

### Required (Production)
- `GEMINI_API_KEY`: Your Google Gemini API key

### Optional
- `GEMINI_MODEL`: Model to use (default: `gemini-2.0-flash`)
- `NODE_ENV`: Set to `production` on production servers
- `VITE_API_URL`: Backend API endpoint (for production frontend)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins

## 🧪 Testing

### Health Check
```bash
curl http://localhost:8787/api/health
```

### Generate Learning Plan
```bash
curl "http://localhost:8787/api/plan/stream?goal=Learn%20Python"
```

## 📁 Project Structure

```
├── App.tsx                 # Main React component
├── components/             # React components
│   ├── ErrorBoundary.tsx   # Error boundary wrapper
│   ├── GoalInput.tsx       # Goal input form
│   ├── LearningPlanDisplay.tsx # Plan display
│   └── ...
├── services/               # Business logic
│   ├── geminiService.ts    # AI API integration
│   └── ...
├── server/                 # Express backend
│   └── index.js           # API server
├── netlify.toml           # Netlify config
├── render.yaml            # Render config
└── vite.config.ts         # Vite config
```

## 📝 API Endpoints

### `GET /api/health`
Health check endpoint
- **Response**: `{ ok: true }`

### `GET /api/plan/stream`
Generate a learning plan (Server-Sent Events)
- **Query Parameters**:
  - `goal` (required): The skill to learn (3-500 chars)
  - `background` (optional): User's background (max 1000 chars)
  - `profileUrl` (optional): Portfolio/profile URL (max 500 chars)
- **Response**: Server-Sent Events with `reasoning` and `complete` events

## 🔒 Security

- API keys stored server-side only
- Input validation on all endpoints
- Rate limiting to prevent abuse
- CORS configured for production domain
- Security headers set on all responses
- Error messages don't leak sensitive information

## 📄 License

MIT

## 🤝 Contributing

Feel free to submit issues and pull requests to help improve Skill Learning Buddy!
