import { LearningPlan, UserContext } from '../types';

// Client-side service now calls our backend API for security

// Read the model from env, default to Gemini 3.0
const getModel = (): string => {
    const importMetaEnv = (typeof import.meta !== 'undefined' && (import.meta as any).env)
        ? (import.meta as any).env
        : undefined;
    const envModel = importMetaEnv
        ? (importMetaEnv.VITE_GEMINI_MODEL || importMetaEnv.GEMINI_MODEL)
        : undefined;
    const model = envModel || process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    return model;
};

// System prompt for generating learning plans
const SYSTEM_PROMPT = `You are an expert educational curriculum designer and learning coach. Your role is to create personalized, actionable learning plans that help people master new skills efficiently.

When creating a learning plan:
1. Break down the skill into logical, progressive modules
2. Estimate realistic time requirements for each topic
3. Provide specific, actionable guidance for each step
4. Recommend high-quality, accessible resources
5. Consider the learner's background and existing skills
6. Assess the feasibility of the timeline given typical learning curves

Always respond with valid JSON matching this exact structure:
{
  "skillName": "The skill being learned",
  "timeline": "Human-readable timeline (e.g., '3 months', '8 weeks')",
  "complexity": "Low" | "Medium" | "High",
  "totalHours": number,
  "feasibility": "Realistic" | "Challenging" | "Unrealistic",
  "feasibilityReason": "Brief explanation of why this timeline is/isn't achievable",
  "topics": [
    {
      "title": "Module title",
      "description": "Brief description of what this module covers",
      "estimatedHours": number,
      "detailedGuidance": ["Step 1...", "Step 2...", ...],
      "resources": [
        {
          "title": "Resource name",
          "searchQuery": "Google search query to find this resource",
          "type": "video" | "article" | "course" | "tool"
        }
      ]
    }
  ]
}`;

// Parse the response to extract the JSON plan
function parseJsonFromResponse(text: string): LearningPlan | null {
    try {
        // Try to find JSON in the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            // Validate required fields
            if (parsed.skillName && parsed.topics && Array.isArray(parsed.topics)) {
                return parsed as LearningPlan;
            }
        }
    } catch (e) {
        console.error('Failed to parse learning plan JSON:', e);
    }
    return null;
}

// Generate a learning plan with streaming reasoning
export async function generateLearningPlanStream(
    goal: string,
    context: UserContext,
    onReasoningUpdate: (text: string) => void
): Promise<LearningPlan> {
    const contextInfo = context.background
        ? `\n\nUser Background: ${context.background}${context.profileUrl ? `\nProfile/Portfolio: ${context.profileUrl}` : ''}`
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

    let fullResponse = '';
    let reasoningBuffer = '';
    let finalPayload = '';
    let sseBuffer = '';

    try {
        const params = new URLSearchParams({
            goal,
            background: context.background || '',
            profileUrl: context.profileUrl || ''
        });
        const resp = await fetch(`/api/plan/stream?${params.toString()}`);
        if (!resp.ok) {
            throw new Error(`Backend error: ${resp.status}`);
        }

        const reader = resp.body?.getReader();
        if (!reader) throw new Error('Streaming not supported');

        const decoder = new TextDecoder();
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            sseBuffer += decoder.decode(value, { stream: true });

            const frames = sseBuffer.split(/\n\n/);
            sseBuffer = frames.pop() || '';

            for (const frame of frames) {
                let event: string | null = null;
                const dataLines: string[] = [];
                for (const line of frame.split(/\r?\n/)) {
                    if (line.startsWith('event:')) event = line.replace('event:', '').trim();
                    else if (line.startsWith('data:')) dataLines.push(line.replace('data:', '').trim());
                }
                if (!event || dataLines.length === 0) continue;

                const dataStr = dataLines.join('\n');
                let payload: any = null;
                try { payload = JSON.parse(dataStr); } catch { continue; }

                if (event === 'reasoning' && payload.text) {
                    fullResponse += payload.text;
                    const jsonStartIndex = fullResponse.indexOf('{');
                    if (jsonStartIndex === -1) {
                        reasoningBuffer = fullResponse;
                        onReasoningUpdate(reasoningBuffer);
                    } else if (reasoningBuffer.length < jsonStartIndex) {
                        reasoningBuffer = fullResponse.substring(0, jsonStartIndex);
                        onReasoningUpdate(reasoningBuffer);
                    }
                } else if (event === 'complete') {
                    if (payload.full) finalPayload = payload.full;
                    else if (payload.text) finalPayload = payload.text;
                } else if (event === 'error') {
                    throw new Error(payload.message || 'Server error');
                }
            }
        }

        const sourceText = finalPayload || fullResponse;
        const plan = parseJsonFromResponse(sourceText);
        if (plan) return plan;
        throw new Error('Failed to parse learning plan from response');
    } catch (error) {
        console.error('Error generating learning plan:', error);
        if (error instanceof Error) {
            if (error.message.includes('API key')) {
                throw new Error('Server API key misconfigured. Contact support.');
            }
            if (error.message.includes('rate')) {
                throw new Error('Rate limit exceeded. Please wait and try again.');
            }
        }
        throw error;
    }
}

// Export a simple non-streaming version for simpler use cases
export async function generateLearningPlan(
    goal: string,
    context: UserContext = { background: '', profileUrl: '' }
): Promise<LearningPlan> {
    return generateLearningPlanStream(goal, context, () => { });
}
