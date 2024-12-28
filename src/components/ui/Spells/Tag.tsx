import cx from 'classnames';
import tagsMap from './tags-map.json';
import React from 'react';
import { useTranslate } from '../../../contexts/Translator.tsx';

export interface TagProps {
    tag: string;
    selected?: boolean;
    onClick?: () => void;
}

export const Tag: React.FC<TagProps> = ({ tag, selected = false, onClick }) => {
    const { currentLocale } = useTranslate();
    const tagData = tagsMap[tag as keyof typeof tagsMap] ?? {
        bg: '#ffffff',
        text: '#000000',
        border: '#000000',
        i18n: {
            en: {
                name: tag,
                descr: tag,
            },
        },
    };
    return (
        <span
            className={cx('border rounded pr-1 pl-1  font-Roboto font-normal', {
                grayscale: !selected,
                'cursor-pointer': onClick,
                'shadow-highlight': selected,
            })}
            style={{
                backgroundColor: tagData.bg,
                color: tagData.text,
                borderColor: tagData.border,
            }}
            title={tagData.i18n[currentLocale].descr ?? tagData.i18n.en.descr}
            onClick={() => onClick && onClick()}
        >
            {tagData.i18n[currentLocale].name ?? tagData.i18n.en.name}
        </span>
    );
};
