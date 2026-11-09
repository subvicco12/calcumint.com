import type {PresentationDefinition} from './types';
/** Existing scalar engine outputs only; no unsupported analytical capability is promised. */
export const technologyScalarPresentation={id:'standard.technology-scalar',domain:'technology-computing',family:'simple-scalar',level:'essential',supportedVisualizations:[],supportsSchedule:false,supportsGoalSolver:false,supportsScenarios:false,supportsSensitivity:false} as const satisfies PresentationDefinition;
