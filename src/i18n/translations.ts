export const translationsList = {
    en: () => import('./en.json'),
    ukr: () => import('./ukr.json'),
    // fr: () => import('./fr.json'),
    // zh: () => import('./zh.json'),
    // de: () => import('./de.json'),
};

export const availableLanguages = {
    ukr: 'Українська 🇺🇦',
    en: 'English 🇬🇧',
    // fr: 'Français 🇫🇷',
    // de: 'Deutsch 🇩🇪',
    // zh: '中文 🇨🇳',
};
