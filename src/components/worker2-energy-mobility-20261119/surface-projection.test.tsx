import {renderToStaticMarkup} from 'react-dom/server';
import {expect,it} from 'vitest';
import {SurfaceSamples} from './surface-samples';

it('projects the original finite samples when the raw extent overflows binary64',()=>{
 const points=[{x:-1.1,y:0,z:-1.1e308},{x:0,y:0,z:0},{x:1.1,y:0,z:1.1e308}];
 const markup=renderToStaticMarkup(<SurfaceSamples output={{points,minimum:-1.1e308,maximum:1.1e308,gridSize:17}}/>);
 expect(markup).not.toMatch(/(?:cx|cy)="(?:NaN|Infinity)"/);
 expect(markup).toContain('1.1e+308');
 expect(markup.match(/<circle/g)).toHaveLength(3);
});
