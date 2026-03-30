export interface LinkItem {
  label: string;
  url: string;
}

export interface Topic {
  id: string;
  title: string;
  summary: string;
  links: LinkItem[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
}

export interface Module {
  id: string;
  title: string;
  description: string;
  topics: Topic[];
  quizLink: string; // Kept for backward compatibility
  questions?: QuizQuestion[]; // New internal quiz support
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface User {
  username: string;
  role: 'admin' | 'user';
}

export interface ModuleProgress {
  moduleId: string;
  completedTopicIds: string[];
  quizScore?: number; // Percentage 0-100
  status: 'not-started' | 'in-progress' | 'completed';
  lastAccessed: string; // ISO Date
}

export interface UserProgress {
  username: string;
  modules: Record<string, ModuleProgress>;
}

export interface PendingChange {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  moduleData?: Module; // Present for CREATE/UPDATE
  targetModuleId?: string; // Present for DELETE/UPDATE
  requestedBy: string;
  timestamp: string;
}