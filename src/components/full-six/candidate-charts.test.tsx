// @vitest-environment jsdom
import {afterEach,it,expect} from 'vitest';
import {render,cleanup} from '@testing-library/react';
import {CandidateCharts} from './candidate-charts';
import type {CandidateArtifact} from '@/lib/full-six/candidate/workflow';
afterEach(cleanup);
it('splits rendered paths when an out-of-range sample is omitted',()=>{const artifact={catalogId:235,output:{request:{minX:'0',maxX:'2'},viewport:{minY:'-1',maxY:'1'},curves:[{samples:[{x:0,y:'0',segmentId:1},{x:1,y:'1e20',segmentId:1},{x:2,y:'0',segmentId:1}]}]}} as unknown as CandidateArtifact;const view=render(<CandidateCharts artifact={artifact}/>);const paths=view.container.querySelectorAll('polyline');expect(paths).toHaveLength(2);expect(paths[0].getAttribute('points')).toBe('0,150');expect(paths[1].getAttribute('points')).toBe('500,150');});
