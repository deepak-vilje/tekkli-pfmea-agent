import { Type } from "@sinclair/typebox";
import { defineTool, toolSuccess } from "./types";

const StepSchema = Type.Object({
  content: Type.String({
    description: "Description of this step",
  }),
  status: Type.Union(
    [
      Type.Literal("pending"),
      Type.Literal("in_progress"),
      Type.Literal("completed"),
    ],
    { description: "Current status of the step" },
  ),
  activeForm: Type.Optional(
    Type.String({
      description:
        "Present-continuous label shown when step is in_progress (e.g. 'Analyzing risk factors')",
    }),
  ),
});

export const updateStepsTool = defineTool({
  name: "update_steps",
  label: "Update Steps",
  description:
    "Display a progress panel showing the steps in a multi-step operation. " +
    "Each call REPLACES the entire step list. " +
    "Use pending/in_progress/completed statuses to show progress. " +
    "The panel auto-collapses when all steps are completed.",
  parameters: Type.Object({
    steps: Type.Array(StepSchema, {
      description: "Complete list of steps (replaces previous list)",
      minItems: 1,
    }),
    explanation: Type.Optional(
      Type.String({
        description: "Brief label shown in tool header (max 50 chars)",
        maxLength: 50,
      }),
    ),
  }),
  execute: async (_toolCallId, params) => {
    return toolSuccess({ steps: params.steps });
  },
});
