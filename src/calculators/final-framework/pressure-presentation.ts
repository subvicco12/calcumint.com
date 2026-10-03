import type { PresentationDefinition } from "./types";

export const pressurePresentation={
  id:"standard.physics-pressure",
  domain:"physics",
  family:"simple-scalar",
  level:"essential",
  supportedVisualizations:[],
  supportsSchedule:false,
  supportsGoalSolver:false,
  supportsScenarios:false,
  supportsSensitivity:false,
} as const satisfies PresentationDefinition;
