import { registerPendingQuestion } from "@office-agents/core";
import { Type } from "@sinclair/typebox";
import { defineTool, toolSuccess } from "./types";

const OptionSchema = Type.Object({
  label: Type.String({ description: "Short label for the option" }),
  description: Type.String({ description: "Longer description of the option" }),
});

const QuestionSchema = Type.Object({
  header: Type.String({
    description:
      "Short section header shown above the question (e.g. 'Risk Rating')",
  }),
  question: Type.String({
    description: "The question text presented to the user",
  }),
  options: Type.Array(OptionSchema, {
    description: "Tappable choices presented to the user",
    minItems: 1,
    maxItems: 8,
  }),
  multiSelect: Type.Boolean({
    description: "Allow multiple options to be selected",
  }),
});

export const askUserQuestionTool = defineTool({
  name: "ask_user_question",
  label: "Ask User",
  description:
    "Present one or more questions with tappable options to the user and wait for their response. " +
    "Use this to get confirmation or choices during a workflow (e.g. 'Accept this risk rating?'). " +
    "Execution pauses until the user responds. " +
    "Returns the selected option labels for each question.",
  parameters: Type.Object({
    questions: Type.Array(QuestionSchema, {
      description: "List of questions to present (1–4)",
      minItems: 1,
      maxItems: 4,
    }),
    explanation: Type.Optional(
      Type.String({
        description: "Brief label shown in tool header (max 50 chars)",
        maxLength: 50,
      }),
    ),
  }),
  execute: async (toolCallId, params) => {
    const answers = await registerPendingQuestion(toolCallId, params.questions);

    const result: Record<string, string[]> = {};
    for (let i = 0; i < params.questions.length; i++) {
      const q = params.questions[i];
      result[q.header || `question_${i + 1}`] = answers[i] ?? [];
    }

    return toolSuccess({ answers: result });
  },
});
