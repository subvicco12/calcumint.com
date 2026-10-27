import type {PresentationDefinition} from './types';

export const cidrPresentation = {
 id: 'standard.technology-cidr',
 domain: 'technology-computing',
 family: 'simple-scalar',
 level: 'essential',
 supportedVisualizations: [],
 supportsSchedule: false,
 supportsGoalSolver: false,
 supportsScenarios: false,
 supportsSensitivity: false,
} as const satisfies PresentationDefinition;
