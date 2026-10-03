import type { PresentationDefinition } from "./types";

export const molarityPresentation={
  id:"standard.chemistry-molarity",
  domain:"chemistry",
  family:"simple-scalar",
  level:"essential",
  supportedVisualizations:[],
  supportsSchedule:false,
  supportsGoalSolver:false,
  supportsScenarios:false,
  supportsSensitivity:false,
} as const satisfies PresentationDefinition;
