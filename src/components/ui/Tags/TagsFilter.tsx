import { Tag } from '@components/ui/Tags/Tag.tsx';
import cx from 'classnames';
import React, { useState } from 'react';
import { useTranslate } from '../../../contexts/Translator.tsx';
import { keys } from '../../../helpers/generic-helpers.tsx';
import tagsMap from './tags-map.json';

export type PossibleTag = keyof typeof tagsMap;

export interface TagsFilterProps {
    availableTags: PossibleTag[];
    selectedTags: PossibleTag[];
    onTagClick: (tag: PossibleTag) => void;
}

export const TagsFilter: React.FC<TagsFilterProps> = ({
    availableTags,
    selectedTags,
    onTagClick,
}) => {
    const [showTags, setShowTags] = useState(false);
    const { tokens } = useTranslate();
    return (
        <>
            <button
                className={cx(
                    'border bg-[#ffffffaa] w-fit p-0.5 pr-[3mm] pl-[3mm] rounded mt-[2mm]',
                    {
                        '!bg-white border-black': showTags,
                    },
                )}
                onClick={() => setShowTags((showTags) => !showTags)}
            >
                {tokens.spells.showTags}
            </button>
            {showTags && (
                <div className='flex flex-wrap gap-[1mm] w-full'>
                    {availableTags.map((tag) => (
                        <Tag
                            tag={tag}
                            selected={selectedTags.includes(tag)}
                            onClick={() => onTagClick(tag)}
                        />
                    ))}
                </div>
            )}
        </>
    );
};
