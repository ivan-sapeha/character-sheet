import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.less';
import { initDB } from 'react-indexed-db-hook';
import { App } from './App.tsx';
import { CurrentCharacterProvider } from './contexts/CurrentCharacter.tsx';
import { TranslateProvider } from './contexts/Translator.tsx';
import { DBConfig } from './db';
import { translationsList } from './i18n/translations.ts';

const root = document.getElementById('root')!;
localStorage.setItem('loaded', (localStorage.getItem('loaded') ?? 0) + 1);
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
