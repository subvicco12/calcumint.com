import { createRoot } from 'react-dom/client';
import { WeatherCalculatorWorkbench } from '../../src/components/weather-calculator-workbench';
import '../../src/components/calculator-factory-controls.css';

createRoot(document.getElementById('root')!).render(<WeatherCalculatorWorkbench
    ownerId="browser-fixture" plan="pro" saveHistory={async () => { throw Error('Fixture has no authenticated persistence'); }}
/>);
