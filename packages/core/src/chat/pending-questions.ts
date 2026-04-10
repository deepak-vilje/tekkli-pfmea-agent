import { writable } from "svelte/store";

export interface QuestionOption {
  label: string;
  description: string;
}

export interface Question {
  header: string;
  question: string;
  options: QuestionOption[];
  multiSelect: boolean;
}

export interface PendingQuestion {
  toolCallId: string;
  questions: Question[];
  resolve: (answers: string[][]) => void;
}

export const pendingQuestions = writable<Map<string, PendingQuestion>>(
  new Map(),
);

export function registerPendingQuestion(
  toolCallId: string,
  questions: Question[],
): Promise<string[][]> {
  return new Promise<string[][]>((resolve) => {
    pendingQuestions.update((map) => {
      const next = new Map(map);
      next.set(toolCallId, { toolCallId, questions, resolve });
      return next;
    });
  });
}

export function resolvePendingQuestion(
  toolCallId: string,
  answers: string[][],
) {
  pendingQuestions.update((map) => {
    const entry = map.get(toolCallId);
    if (entry) {
      entry.resolve(answers);
      const next = new Map(map);
      next.delete(toolCallId);
      return next;
    }
    return map;
  });
}
