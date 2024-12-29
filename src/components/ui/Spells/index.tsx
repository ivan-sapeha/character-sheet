import { TextInput } from '@components/ui/Inputs/TextInput.tsx';
import { Spell } from '@components/ui/Spells/Spell.tsx';
import { TagsFilter } from '@components/ui/Tags/TagsFilter.tsx';
import { SpellTracker } from '@components/ui/Weapons/SpellTracker.tsx';
import { decode } from '@msgpack/msgpack';
import cx from 'classnames';
import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useIndexedDB } from 'react-indexed-db-hook';
import { useTranslate } from '../../../contexts/Translator.tsx';
import { keys } from '../../../helpers/generic-helpers.tsx';
import { useCharacter } from '../../../hooks/useCharacter.ts';
import tagsMap from '../Tags/tags-map.json';

export const Spells = () => {
    const { currentCharacter, isPrinting } = useCharacter();
    const { currentLocale, tokens } = useTranslate();
    const [filter, setFilter] = useState('');
    const [spells, setSpells] = useState<Spell[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTags, setSelectedTags] = useState<
        Array<keyof typeof tagsMap>
    >([]);
    const { getByIndex } = useIndexedDB('spells');
    const [maximizedSpells, setMaximizedSpells] = useState<number[]>([]);
    const charSpells = currentCharacter.spells.map(
        (spellId) => spells.find((spell) => spell.id === spellId)!,
    );

    const onTagClick = (tag: keyof typeof tagsMap) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(
                selectedTags.filter((selectedTag) => selectedTag !== tag),
            );
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const onSpellClick = (id: number) => {
        if (maximizedSpells.includes(id)) {
            setMaximizedSpells(maximizedSpells.filter((maxId) => maxId !== id));
        } else {
            setMaximizedSpells([...maximizedSpells, id]);
        }
    };

    useEffect(() => {
        getByIndex('lang', currentLocale).then(
            (spell: { data: Uint8Array }) => {
                const spells = decode(spell.data) as Spell[];
                setSpells(spells);
                setIsLoading(false);
            },
        );
    }, [currentLocale]);

    return (
        !isLoading && (
            <div className='flex flex-col gap-[3mm]'>
                {!isPrinting && (
                    <h1 className={'bg-[#00000077] text-white text-center'}>
                        {tokens.UI.spells}
                    </h1>
                )}
                {isMobile && !isPrinting && (
                    <div className='flex flex-col gap-[3mm] font-normal items-center'>
                        <SpellTracker />
                        <TagsFilter
                            availableTags={keys(tagsMap).filter((tag) =>
                                charSpells.some((spell) =>
                                    spell.tags.includes(tag),
                                ),
                            )}
                            selectedTags={selectedTags}
                            onTagClick={onTagClick}
                        />

                        <TextInput
                            value={filter}
                            onChange={(text) => setFilter(text)}
                            className={'!bg-white !font-Roboto !font-normal'}
                            placeholder={tokens.UI.search}
                        />
                    </div>
                )}
                <div
                    className={cx('flex flex-col', {
                        'leading-[6mm]': isPrinting,
                    })}
                >
                    {charSpells
                        .filter(
                            (spell) =>
                                (spell.name
                                    .toLowerCase()
                                    .includes(filter.toLowerCase()) ||
                                    spell.originalName
                                        ?.toLowerCase()
                                        .includes(filter.toLowerCase()) ||
                                    spell.level.toString() === filter) &&
                                selectedTags.every((tag) =>
                                    spell.tags.includes(tag),
                                ),
                        )
                        .map((spell) => (
                            <Spell
                                key={spell.id}
                                spell={spell}
                                className='bg-[#ffffffdd]'
                                filter={filter}
                                minimized={
                                    !maximizedSpells.includes(spell.id) &&
                                    !isPrinting
                                }
                                onClick={() => onSpellClick(spell.id)}
                            />
                        ))}
                </div>
            </div>
        )
    );
};
