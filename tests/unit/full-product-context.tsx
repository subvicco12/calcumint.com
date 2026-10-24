// Existing component tests exercise the full product. Supply the same explicit
// capability provider as RootLayout; nested public-only providers take priority.
import {vi} from 'vitest';
import {type ReactNode,type ComponentType} from 'react';
import {ProductCapabilitiesProvider} from '../../src/components/product-capabilities';
import {capabilitiesForMode} from '../../src/lib/product-mode';
function FullProduct({children}:{children:ReactNode}) {
 return <ProductCapabilitiesProvider capabilities={capabilitiesForMode('full')}>{children}</ProductCapabilitiesProvider>;
}
vi.mock('@testing-library/react',async importOriginal=>{
 const actual=await importOriginal<typeof import('@testing-library/react')>();
 return {...actual,
  render:(...args:Parameters<typeof actual.render>)=>{
   const [ui,options]=args;const Existing=options?.wrapper as ComponentType<{children:ReactNode}>|undefined;
   return actual.render(ui,{...options,wrapper:({children}:{children:ReactNode})=><FullProduct>{Existing?<Existing>{children}</Existing>:children}</FullProduct>});
  },
  renderHook:(callback: (props: unknown)=>unknown,options?:Parameters<typeof actual.renderHook>[1])=>{
   const Existing=options?.wrapper as ComponentType<{children:ReactNode}>|undefined;
   return actual.renderHook(callback,{...options,wrapper:({children}:{children:ReactNode})=><FullProduct>{Existing?<Existing>{children}</Existing>:children}</FullProduct>});
  }
 };
});
vi.mock('react-dom/server',async importOriginal=>{
 const actual=await importOriginal<typeof import('react-dom/server')>();
 return {...actual,
  renderToStaticMarkup:(node:ReactNode,options?:Parameters<typeof actual.renderToStaticMarkup>[1])=>actual.renderToStaticMarkup(<FullProduct>{node}</FullProduct>,options),
  renderToString:(node:ReactNode,options?:Parameters<typeof actual.renderToString>[1])=>actual.renderToString(<FullProduct>{node}</FullProduct>,options)
 };
});
