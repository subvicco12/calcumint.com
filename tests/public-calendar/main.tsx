import { createRoot } from 'react-dom/client';
import { PublicCalendarTool } from '../../src/components/public-calendar-tools';

createRoot(document.getElementById('root')!).render(<PublicCalendarTool slug={new URLSearchParams(location.search).get('slug') ?? ''} />);
