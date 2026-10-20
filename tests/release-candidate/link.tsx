import {forwardRef,type ComponentProps} from 'react';
// Only navigation is adapted; the actual account action component owns focus.
export default forwardRef<HTMLAnchorElement,ComponentProps<'a'>>(function FixtureLink(props,ref){return <a {...props} ref={ref}/>;});
