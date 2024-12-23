import { Dialog, DialogProps } from '@components/ui/Dialog';
import { Spell } from '@components/ui/Spells/Spell.tsx';
import React, { useEffect, useState } from 'react';
import { useIndexedDB } from 'react-indexed-db-hook';
import { useTranslate } from '../../../contexts/Translator.tsx';
import { decode } from '@msgpack/msgpack';
import { entries } from '../../../helpers/generic-helpers.tsx';
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
    // const sources = useMemo(
    //     () => [...new Set(spells.map((spell) => spell.source))],
    //     [currentLocale],
    // );

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

    return (
        <Dialog open={open} onClose={onClose} className='overflow-hidden'>
            {isLoading ? (
                <div className='w-full h-full grid place-items-center'>
                    Loading...
                </div>
            ) : (
                <div
                    className={
                        'flex flex-col bg-[#ffffff77] gap-[3mm] p-2 font-normal w-full h-full overflow-auto'
                    }
                >
                    <div className='flex gap-[1mm] flex-wrap'>
                        {currentCharacter.spells.map((spellId) => {
                            const spell = spells.find(
                                (spell) => spell.id === spellId,
                            )!;
                            return (
                                <span
                                    key={spellId}
                                    className='border border-black rounded-[1.5mm] pt-[0.5mm] pb-[0.5mm] pr-[1mm] pl-[1mm] bg-white cursor-pointer'
                                    onClick={() => removeSpell(spellId)}
                                >
                                    {spell.name}({spell.level})
                                </span>
                            );
                        })}
                    </div>
                    <div className='flex flex-wrap'>
                        <input
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className='border border-black'
                        />
                        <select
                            className='border border-black'
                            value={schoolFilter}
                            onChange={(e) => setSchoolFilter(e.target.value)}
                        >
                            <option value={defaultSelect}>
                                {tokens.spells.all}
                            </option>
                            {entries(tokens.spells.schools).map(
                                ([key, name]) => (
                                    <option key={key} value={key}>
                                        {name}
                                    </option>
                                ),
                            )}
                        </select>
                        <select
                            className='border border-black'
                            value={classFilter}
                            onChange={(e) => setClassFilter(e.target.value)}
                        >
                            <option value={defaultSelect}>
                                {tokens.spells.all}
                            </option>
                            {entries(tokens.spells.classes)
                                .filter(
                                    ([key, _]) =>
                                        key !== 'Optional' &&
                                        key !== 'Dunamancy',
                                )
                                .map(([key, name]) => (
                                    <option key={key} value={key}>
                                        {name}
                                    </option>
                                ))}
                        </select>
                        <select
                            className='border border-black'
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

                        <button
                            onClick={onSave}
                            className='border border-black rounded-[1.5mm] pt-[0.5mm] pb-[0.5mm] pr-[1mm] pl-[1mm] bg-white cursor-pointer'
                        >
                            {tokens.UI.save}
                        </button>
                    </div>
                    {/*{sources.map((source) => (*/}
                    {/*    <div key={source}>{source}</div>*/}
                    {/*))}*/}
                    <div className='overflow-auto flex flex-col gap-[3mm]'>
                        {(filteredSpells as Spell[]).map((spell) => (
                            <Spell
                                key={spell.id}
                                spell={spell}
                                filter={filter}
                                selected={currentCharacter.spells.includes(
                                    spell.id,
                                )}
                                onClick={(selected) => {
                                    if (selected) {
                                        addSpell(spell.id);
                                    } else {
                                        removeSpell(spell.id);
                                    }
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </Dialog>
    );
};
