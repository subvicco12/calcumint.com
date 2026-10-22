// @vitest-environment jsdom
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
import BusinessError from './error';
afterEach(cleanup);
it('announces an uncertain outcome without disclosing private failure details or claiming rollback',()=>{const retry=vi.fn();render(<BusinessError error={new Error('private API credentials and backend detail')} retry={retry}/>);expect(screen.getByRole('alert').textContent).toContain('could not confirm');expect(document.body.textContent).not.toContain('private API');expect(document.body.textContent).not.toContain('has not been changed');expect(retry).not.toHaveBeenCalled();expect(screen.getByRole('link',{name:'Business workspace'}).getAttribute('href')).toBe('/business');});
it('offers explicit read-only retry and focuses its heading when the failed control disappears',()=>{const retry=vi.fn();render(<BusinessError error={new Error('failure')} retry={retry}/>);expect(document.activeElement).toBe(screen.getByRole('heading',{level:1}));fireEvent.click(screen.getByRole('button',{name:'Reload workspace'}));expect(retry).toHaveBeenCalledTimes(1);});
