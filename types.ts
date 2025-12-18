
export interface LearningResource {
  title: string;
  url?: string; // Optional now, we prefer smart links
  searchQuery: string; // The specific query to find this resource reliably
  type: 'video' | 'article' | 'course' | 'tool';
}

export interface LearningTopic {
  title: string;
  description: string;
  estimatedHours: number;
  detailedGuidance: string[]; // Step-by-step actionable instructions
  resources: LearningResource[]; // Curated links from search
}

export interface LearningPlan {
  id?: string; // Unique ID for history
  createdAt?: string; // Date for history
  skillName: string;
  timeline: string;
  complexity: 'Low' | 'Medium' | 'High';
  totalHours: number;
  feasibility: 'Realistic' | 'Challenging' | 'Unrealistic';
  feasibilityReason: string;
  topics: LearningTopic[];
}

export interface ReasoningState {
  steps: string[];
  isThinking: boolean;
  isComplete: boolean;
}

export enum ImageSize {
  Size_1K = '1K',
  Size_2K = '2K',
  Size_4K = '4K',
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  size?: string;
}

export interface UserContext {
  background: string;
  profileUrl: string;
}

// Global interface for AI Studio embedded window object
declare global {
  // We augment the existing AIStudio interface to include the methods we need.
  // The property 'aistudio' is already defined on Window with type 'AIStudio'.
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}
