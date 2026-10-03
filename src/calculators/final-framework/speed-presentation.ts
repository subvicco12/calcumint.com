import type { PresentationDefinition } from "./types";

export const speedPresentation={
  id:"standard.physics-speed",
  domain:"physics",
  family:"simple-scalar",
  level:"essential",
  supportedVisualizations:[],
  supportsSchedule:false,
  supportsGoalSolver:false,
  supportsScenarios:false,
  supportsSensitivity:false,
} as const satisfies PresentationDefinition;
