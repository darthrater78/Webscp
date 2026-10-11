import { createRoot } from 'react-dom/client';
import '@fontsource/source-sans-3/latin-400.css';
import '@fontsource/source-sans-3/latin-600.css';
import '@fontsource/source-sans-3/latin-700.css';
import '@fontsource/jetbrains-mono/latin-400.css';
import '@fontsource/jetbrains-mono/latin-600.css';
import '../../src/index.css';
import { Commander } from '../../src/layouts/Commander';
import { TabbedSingle } from '../../src/layouts/TabbedSingle';

const params = new URLSearchParams(location.search);
const theme = params.get('theme') === 'dark' ? 'dark' : 'light';
document.documentElement.setAttribute('data-theme', theme);
createRoot(document.getElementById('root')!).render(params.get('layout') === 'tabbed' ? <TabbedSingle /> : <Commander />);
