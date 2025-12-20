# 🎓 Skill Learning Buddy

A React-based AI assistant designed to help you master new skills, powered by Google's Gemini API.

## 🚀 Overview

Skill Learning Buddy is an interactive application that acts as your personal tutor. Whether you want to learn a new programming language, a musical instrument, or a soft skill, this AI companion helps structure your learning path, answer questions, and track progress.

Built with:
- **React** (via Vite)
- **TypeScript**
- **Google Generative AI SDK** (`@google/genai`)

## ✨ Features

- **Interactive Chat**: Ask questions and get instant, context-aware answers.
- **Modern UI**: Clean and responsive interface built with React.

## 🛠️ How to Run

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Configure API**
    Create `.env.local` in the root directory and add your Gemini config:
    ```env
    GEMINI_API_KEY=your_api_key_here
    # Optional: choose model (defaults to gemini-1.5-flash-latest)
    GEMINI_MODEL=gemini-1.5-flash-latest
    # Or, if you prefer import.meta exposure
    # VITE_GEMINI_MODEL=gemini-2.0-flash-exp
    ```
    > You can get a key from [Google AI Studio](https://aistudio.google.com/).

3.  **Start Development Server**
    ```bash
    npm run dev
    ```

4.  **Open in Browser**
    Navigate to `http://localhost:3000`
