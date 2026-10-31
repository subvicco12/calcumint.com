// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AiFinder } from './ai-finder';

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
const item = { slug: 'percentage-of-value-calculator', category: 'math', description: 'Percentage calculator', url: '/calculators/math/percentage-of-value-calculator' };
const reply = (payload: unknown, ok = true) => ({ ok, text: async () => JSON.stringify(payload) }) as Response;
function submit(query = 'percentage') {
  fireEvent.change(screen.getByRole('textbox'), { target: { value: query } });
  fireEvent.submit(screen.getByRole('button').closest('form')!);
}
function deferred() {
  let resolve!: (value: Response) => void;
  const promise = new Promise<Response>(done => { resolve = done; });
  return { promise, resolve };
}

describe('finder query and recovery workflow', () => {
  it('removes previous actionable results when a new search starts', async () => {
    const pending = deferred();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(reply({ recommendations: [item] })).mockReturnValueOnce(pending.promise));
    render(<AiFinder />);
    submit();
    await screen.findByRole('link');
    submit('conversion');
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByRole('status').textContent).toContain('conversion');
  });

  it('aborts edited requests and ignores late responses even when transport ignores abort', async () => {
    const pending = deferred();
    const fetch = vi.fn().mockReturnValueOnce(pending.promise).mockResolvedValueOnce(reply({ recommendations: [] }));
    vi.stubGlobal('fetch', fetch);
    render(<AiFinder />);
    submit();
    const signal = fetch.mock.calls[0][1].signal as AbortSignal;
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'conversion' } });
    expect(signal.aborted).toBe(true);
    expect(screen.getByRole('button').hasAttribute('disabled')).toBe(false);
    submit('conversion');
    await waitFor(() => expect(screen.getByRole('status').textContent).toContain('No calculators'));
    await act(async () => pending.resolve(reply({ recommendations: [item] })));
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByRole('status').textContent).toContain('conversion');
  });

  it.each([
    { recommendations: {} },
    { recommendations: [{ ...item, url: 'https://example.com' }] },
    { recommendations: [{ ...item, url: '/calculators/health/percentage' }] },
    { recommendations: [{ ...item, reason: { bad: true } }] },
    null,
  ])('recovers from malformed success payload %j', async payload => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(reply(payload)).mockResolvedValueOnce(reply({ recommendations: [item], usedAi: false })));
    render(<AiFinder />);
    submit();
    expect((await screen.findByRole('alert')).textContent).toContain('invalid response');
    expect(screen.queryByRole('link')).toBeNull();
    submit();
    expect((await screen.findByRole('link')).getAttribute('href')).toBe(item.url);
    expect(screen.getByRole('status').textContent).toContain('percentage');
  });

  it.each(['', '<html>Unavailable</html>'])('allows retry after a non-JSON response %j', async body => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({ ok: false, text: async () => body }).mockResolvedValueOnce(reply({ recommendations: [] })));
    render(<AiFinder />);
    submit();
    await screen.findByRole('alert');
    submit();
    await waitFor(() => expect(screen.getByRole('status').textContent).toContain('No calculators'));
  });

  it('announces API errors and preserves the query for retry', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(reply({ error: 'Daily AI limit reached.' }, false)));
    render(<AiFinder />);
    submit();
    expect((await screen.findByRole('alert')).textContent).toContain('Daily AI limit reached.');
    expect((screen.getByRole('textbox') as HTMLTextAreaElement).value).toBe('percentage');
  });

  it('keeps a replacement result when an obsolete request fails late', async () => {
    const pending = deferred();
    vi.stubGlobal('fetch', vi.fn().mockReturnValueOnce(pending.promise).mockResolvedValueOnce(reply({ recommendations: [item] })));
    render(<AiFinder />);
    submit('old query');
    submit('percentage');
    await screen.findByRole('link');
    await act(async () => pending.resolve(reply({ error: 'Obsolete error' }, false)));
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByRole('link').getAttribute('href')).toBe(item.url);
    expect(screen.getByRole('status').textContent).toContain('percentage');
  });

  it('recovers after a network failure without losing the entered query', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValueOnce(new TypeError('Network unavailable')).mockResolvedValueOnce(reply({ recommendations: [item] })));
    render(<AiFinder />);
    submit();
    await screen.findByRole('alert');
    expect((screen.getByRole('textbox') as HTMLTextAreaElement).value).toBe('percentage');
    submit();
    await screen.findByRole('link');
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('prevents duplicate in-flight submissions and aborts on unmount', () => {
    const pending = deferred(), fetch = vi.fn().mockReturnValue(pending.promise);
    vi.stubGlobal('fetch', fetch);
    const view = render(<AiFinder />);
    submit();
    fireEvent.submit(screen.getByRole('button').closest('form')!);
    expect(fetch).toHaveBeenCalledTimes(1);
    const signal = fetch.mock.calls[0][1].signal as AbortSignal;
    view.unmount();
    expect(signal.aborted).toBe(true);
  });
});
