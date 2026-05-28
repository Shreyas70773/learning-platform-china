// Shared, client-safe types (no Node-only imports).

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

export type ModuleQuizRecord = {
  quizScore: number; // 0..100
  passed: boolean;
  attemptedAt: string; // ISO
};

export type CompletionRecord = {
  completed: boolean;
  completedAt?: string; // ISO
};

export type Progress = {
  video: CompletionRecord;
  theory: Record<string, ModuleQuizRecord>; // keyed by module id "1".."6"
  labsPractical: Record<string, CompletionRecord>; // "1".."6"
  labsAI: Record<string, CompletionRecord>; // "1".."7"
};
