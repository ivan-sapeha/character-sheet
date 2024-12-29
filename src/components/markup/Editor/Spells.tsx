import { Dialog, DialogProps } from '@components/ui/Dialog';
import { FloatingActionButton } from '@components/ui/FAB/FloatingActionButton.tsx';
import { magicSchoolsByColor, Spell } from '@components/ui/Spells/Spell.tsx';
import { Tag } from '@components/ui/Tags/Tag.tsx';
import tagsMap from '@components/ui/Tags/tags-map.json';
import { TagsFilter } from '@components/ui/Tags/TagsFilter.tsx';
import cx from 'classnames';
import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useIndexedDB } from 'react-indexed-db-hook';
import { useTranslate } from '../../../contexts/Translator.tsx';
import { decode } from '@msgpack/msgpack';
import { entries, keys } from '../../../helpers/generic-helpers.tsx';
import { useCharacter } from '../../../hooks/useCharacter.ts';

const defaultSelect = 'all';
export const SpellsDialog: React.FC<DialogProps> = ({ open, onClose }) => {
    const { currentLocale, tokens } = useTranslate();
    const { currentCharacter, updateStat, saveCharacter } = useCharacter();
    const { getByIndex } = useIndexedDB('spells');
    const [spells, setSpells] = useState<Spell[]>([]);
    const [filter, setFilter] = useState<string>('');
    const [classFilter, setClassFilter] = useState(defaultSelect);
    const [schoolFilter, setSchoolFilter] = useState(defaultSelect);
    const [levelFilter, setLevelFilter] = useState(defaultSelect);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTags, setSelectedTags] = useState<
        Array<keyof typeof tagsMap>
    >([]);
    const filteredSpells = spells.filter((spell) => {
        const name =
            spell.name.toLowerCase().includes(filter.toLowerCase()) ||
            spell.originalName?.toLowerCase().includes(filter.toLowerCase());
        const level =
            levelFilter === defaultSelect
                ? true
                : spell.level.toString() === levelFilter;
        const clas =
            classFilter === defaultSelect
                ? true
                : spell.classes.includes(classFilter);
        const school =
            schoolFilter === defaultSelect
                ? true
                : spell.school === schoolFilter;
        return name && level && clas && school;
    });

    console.log('render', {
        isLoading,
        selectedTags,
        filter,
        filteredSpells,
        classFilter,
        levelFilter,
        schoolFilter,
        tokens,
        currentLocale,
    });
    const addSpell = (spellId: number) => {
        updateStat(
            'spells',
            [...currentCharacter.spells, spellId].sort((a, b) => a - b),
        );
    };

    const removeSpell = (spellId: number) => {
        updateStat(
            'spells',
            currentCharacter.spells.toSpliced(
                currentCharacter.spells.findIndex((id) => id === spellId),
                1,
            ),
        );
    };

    const onTagClick = (tag: keyof typeof tagsMap) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(
                selectedTags.filter((selectedTag) => selectedTag !== tag),
            );
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const onSave = () => {
        saveCharacter(currentCharacter);
        onClose();
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

    const currentSpells = (
        <div className='flex gap-[1mm] flex-wrap bg-[#ffffff77] p-[1mm] rounded items-center'>
            {tokens.UI.spells}:{' '}
            {currentCharacter.spells.map((spellId) => {
                const spell = spells.find((spell) => spell.id === spellId);
                return (
                    spell && (
                        <span
                            key={spellId}
                            className='border border-black rounded-[1.5mm] pt-[0.5mm] pb-[0.5mm] pr-[1mm] pl-[1mm] bg-white cursor-pointer'
                            style={{
                                borderColor:
                                    magicSchoolsByColor[
                                        spell.school as keyof typeof magicSchoolsByColor
                                    ],
                            }}
                            onClick={() => removeSpell(spellId)}
                        >
                            {spell.name}({spell.level})
                        </span>
                    )
                );
            })}
        </div>
    );

    const filters = (
        <div className='flex flex-col items-center gap-[1mm]'>
            <button
                onClick={onSave}
                className='border border-black rounded-[1.5mm] pt-[0.5mm] pb-[0.5mm] pr-[1mm] pl-[1mm] bg-white cursor-pointer'
            >
                {tokens.UI.save}
            </button>
            <div className='flex flex-col items-center w-full'>
                <label>{tokens.UI.search}</label>
                <input
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className='border border-black h-[28px] w-full max-w-[100mm] pr-[1mm] pl-[1mm] font-Roboto font-normal'
                />
            </div>
            <div className='flex gap-[3mm]'>
                <div className='flex flex-col items-center'>
                    <label>{tokens.spells.school}</label>
                    <select
                        className='border border-black h-[28px]'
                        value={schoolFilter}
                        onChange={(e) => setSchoolFilter(e.target.value)}
                    >
                        <option value={defaultSelect}>
                            {tokens.spells.all}
                        </option>
                        {entries(tokens.spells.schools).map(([key, name]) => (
                            <option key={key} value={key}>
                                {name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='flex flex-col items-center'>
                    <label>{tokens.miniLore.class}</label>
                    <select
                        className='border border-black h-[28px]'
                        value={classFilter}
                        onChange={(e) => setClassFilter(e.target.value)}
                    >
                        <option value={defaultSelect}>
                            {tokens.spells.all}
                        </option>
                        {entries(tokens.spells.classes)
                            .filter(
                                ([key, _]) =>
                                    key !== 'Optional' && key !== 'Dunamancy',
                            )
                            .map(([key, name]) => (
                                <option key={key} value={key}>
                                    {name}
                                </option>
                            ))}
                    </select>
                </div>
                <div className='flex flex-col items-center'>
                    <label>{tokens.spells.level}</label>
                    <select
                        className='border border-black h-[28px]'
                        value={levelFilter}
                        onChange={(e) => setLevelFilter(e.target.value)}
                    >
                        <option value={defaultSelect}>
                            {tokens.spells.all}
                        </option>
                        {Array.from({ length: 10 }, (_, i) => i).map(
                            (level) => (
                                <option key={level} value={level}>
                                    {level === 0
                                        ? tokens.spells.cantrip
                                        : `${level} ${tokens.spells.level}`}
                                </option>
                            ),
                        )}
                    </select>
                </div>
            </div>
            <TagsFilter
                availableTags={keys(tagsMap).filter((tag) =>
                    filteredSpells.some((spell) => spell.tags.includes(tag)),
                )}
                selectedTags={selectedTags}
                onTagClick={onTagClick}
            />
        </div>
    );

    return (
        <Dialog
            open={open}
            onClose={onClose}
            className={cx('!max-h-full w-full', {
                '!pr-0 !pl-0': isMobile,
            })}
        >
            {isLoading ? (
                <div className='w-full h-full grid place-items-center bg-[#ffffff77]'>
                    Loading...
                </div>
            ) : (
                <div
                    className={
                        'flex flex-col bg-[#ffffff77] gap-[3mm] p-2 font-normal w-full h-fit'
                    }
                >
                    {currentSpells}
                    {filters}
                    <div className='flex flex-col'>
                        {(filteredSpells as Spell[])
                            .filter((spell) =>
                                selectedTags.every((tag) =>
                                    spell.tags.includes(tag),
                                ),
                            )
                            .map((spell) => {
                                const selected =
                                    currentCharacter.spells.includes(spell.id);
                                return (
                                    <Spell
                                        key={spell.id}
                                        spell={spell}
                                        filter={filter}
                                        selected={selected}
                                        onClick={() => {
                                            if (selected) {
                                                removeSpell(spell.id);
                                            } else {
                                                addSpell(spell.id);
                                            }
                                        }}
                                    />
                                );
                            })}
                    </div>
                </div>
            )}
        </Dialog>
    );
};
