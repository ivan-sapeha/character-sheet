import { TextInput } from '@components/ui/Inputs/TextInput.tsx';
import { Spell } from '@components/ui/Spells/Spell.tsx';
import { Tag } from '@components/ui/Spells/Tag.tsx';
import { decode } from '@msgpack/msgpack';
import cx from 'classnames';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useIndexedDB } from 'react-indexed-db-hook';
import { useTranslate } from '../../../contexts/Translator.tsx';
import { keys } from '../../../helpers/generic-helpers.tsx';
import { useCharacter } from '../../../hooks/useCharacter.ts';
import tagsMap from './tags-map.json';

export const Spells = () => {
    const { currentCharacter } = useCharacter();
    const { currentLocale, tokens } = useTranslate();
    const [filter, setFilter] = useState('');
    const [spells, setSpells] = useState<Spell[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showTags, setShowTags] = useState(false);
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
                <h1 className={'bg-[#00000077] text-white text-center'}>
                    {tokens.UI.spells}
                </h1>
                {isMobile && (
                    <div className='flex flex-col gap-[3mm] font-Roboto font-normal items-center'>
                        <button
                            className={cx(
                                'border bg-[#ffffffaa] w-fit p-1 pr-[3mm] pl-[3mm] rounded',
                                {
                                    '!bg-white border-black': showTags,
                                },
                            )}
                            onClick={() => setShowTags((showTags) => !showTags)}
                        >
                            {tokens.spells.showTags}
                        </button>
                        {showTags && (
                            <div className='flex flex-wrap gap-[1mm]'>
                                {keys(tagsMap)
                                    .filter((tag) =>
                                        charSpells.some((spell) =>
                                            spell.tags.includes(tag),
                                        ),
                                    )
                                    .map((tag) => (
                                        <Tag
                                            tag={tag}
                                            selected={selectedTags.includes(
                                                tag,
                                            )}
                                            onClick={() => onTagClick(tag)}
                                        />
                                    ))}
                            </div>
                        )}
                        <TextInput
                            value={filter}
                            onChange={(text) => setFilter(text)}
                            className={'!bg-white !font-Roboto !font-normal'}
                            placeholder={tokens.UI.search}
                        />
                    </div>
                )}
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
                            minimized={!maximizedSpells.includes(spell.id)}
                            onClick={() => onSpellClick(spell.id)}
                        />
                    ))}
            </div>
        )
    );
};
