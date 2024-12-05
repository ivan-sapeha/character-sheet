import React, { useContext, useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import en from '../i18n/en.json';
import { availableLanguages, translationsList } from '../i18n/translations.ts';

export type Locale = keyof typeof translationsList;
type LocaleTokens = typeof en;

export interface TranslatorContextValue {
    translations: { [key in Locale]: () => Promise<LocaleTokens> };
    loadedTranslations: Partial<{ [key in Locale]: LocaleTokens }>;
    setLoadedTranslations: (trans: { [key in Locale]: LocaleTokens }) => void;
    defaultLocale: Locale;
    currentLocale: Locale;
    setCurrentLocale: (locale: Locale) => void;
    tokens: LocaleTokens;
    setTokens: (tokens: LocaleTokens) => void;
}

export const TranslatorContext = React.createContext<TranslatorContextValue>({
    translations: {} as any,
    defaultLocale: 'en',
    currentLocale: 'en',
    setCurrentLocale: () => {},
    loadedTranslations: {},
    setLoadedTranslations: () => {},
    tokens: en,
    setTokens: () => {},
});

interface TranslateProviderProps extends React.PropsWithChildren {
    translations: { [key in Locale]: () => Promise<LocaleTokens> };
    defaultLocale: Locale;
}

export const TranslateProvider: React.FC<TranslateProviderProps> = ({
    children,
    translations,
    defaultLocale,
}) => {
    const [currentLocale, setCurrentLocale] = useLocalStorage<Locale>(
        'locale',
        defaultLocale,
    );
    const [loadedTranslations, setLoadedTranslations] = useState<
        TranslatorContextValue['loadedTranslations']
    >({ en });
    const [tokens, setTokens] = useState(en);

    return (
        <TranslatorContext.Provider
            value={{
                translations,
                defaultLocale,
                currentLocale,
                setCurrentLocale,
                loadedTranslations,
                setLoadedTranslations,
                tokens,
                setTokens,
            }}
        >
            {children}
        </TranslatorContext.Provider>
    );
};

export function useTranslate() {
    const {
        translations,
        setLoadedTranslations,
        loadedTranslations,
        setCurrentLocale,
        tokens,
        setTokens,
        currentLocale,
    } = useContext(TranslatorContext);
    const load = (locale: Locale) => {
        if (loadedTranslations[locale]) {
            setCurrentLocale(locale);
            setTokens(loadedTranslations[locale ?? 'en']!);
        } else {
            translations[locale]().then((result) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                setLoadedTranslations({
                    ...loadedTranslations,
                    [locale]: result,
                });
                setCurrentLocale(locale);
                setTokens(result);
            });
        }
    };

    useEffect(() => {
        load(currentLocale);
    }, [currentLocale]);

    return {
        tokens,
        load,
        availableLanguages,
        currentLocale,
    };
}
