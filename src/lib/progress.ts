import type { Progress } from '@/lib/types';

export function emptyProgress(): Progress {
  return { video: { completed: false }, theory: {}, labsPractical: {}, labsAI: {} };
}

/** Defensive merge so older/partial records always read as a full Progress. */
export function normalizeProgress(p: Partial<Progress> | null | undefined): Progress {
  return {
    video: p?.video ?? { completed: false },
    theory: p?.theory ?? {},
    labsPractical: p?.labsPractical ?? {},
    labsAI: p?.labsAI ?? {},
  };
}

export function videoDone(p: Progress): boolean {
  return Boolean(p.video?.completed);
}

export function theoryPassedCount(p: Progress): number {
  return Object.values(p.theory ?? {}).filter((r) => r?.passed).length;
}

export function modulePassed(p: Progress, moduleId: number): boolean {
  return Boolean(p.theory?.[String(moduleId)]?.passed);
}

export function moduleScore(p: Progress, moduleId: number): number | null {
  const r = p.theory?.[String(moduleId)];
  return r ? r.quizScore : null;
}

/** Module 1 is always open; module N unlocks once N-1's quiz is passed. */
export function isModuleUnlocked(p: Progress, moduleId: number): boolean {
  if (moduleId <= 1) return true;
  return modulePassed(p, moduleId - 1);
}

export function moduleStatus(
  p: Progress,
  moduleId: number,
): 'locked' | 'notStarted' | 'inProgress' | 'passed' {
  if (!isModuleUnlocked(p, moduleId)) return 'locked';
  const r = p.theory?.[String(moduleId)];
  if (!r) return 'notStarted';
  return r.passed ? 'passed' : 'inProgress';
}

export function labDone(p: Progress, track: 'practical' | 'ai', id: number): boolean {
  const bucket = track === 'practical' ? p.labsPractical : p.labsAI;
  return Boolean(bucket?.[String(id)]?.completed);
}

export function labsDoneCount(p: Progress, track: 'practical' | 'ai'): number {
  const bucket = track === 'practical' ? p.labsPractical : p.labsAI;
  return Object.values(bucket ?? {}).filter((r) => r?.completed).length;
}
