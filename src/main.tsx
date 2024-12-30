// import { scan } from 'react-scan'; // import this BEFORE react
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.less';
import { initDB } from 'react-indexed-db-hook';
import { App } from './App.tsx';
import { CurrentCharacterProvider } from './contexts/CurrentCharacter.tsx';
import { TranslateProvider } from './contexts/Translator.tsx';
import { DBConfig } from './db';
import { translationsList } from './i18n/translations.ts';
// import { registerSW } from 'virtual:pwa-register';
// if (
//     typeof window !== 'undefined' &&
//     location.hostname.startsWith('localhost')
// ) {
//     scan({
//         enabled: true,
//         log: true, // logs render info to console (default: false)
//     });
// }
const root = document.getElementById('root')!;
localStorage.setItem(
    'loaded',
    String(Number(localStorage.getItem('loaded') ?? 0) + 1),
);
initDB(DBConfig);

ReactDOM.createRoot(root).render(
    <React.StrictMode>
        <TranslateProvider translations={translationsList} defaultLocale={'en'}>
            <CurrentCharacterProvider>
                <App />
            </CurrentCharacterProvider>
        </TranslateProvider>
    </React.StrictMode>,
);
