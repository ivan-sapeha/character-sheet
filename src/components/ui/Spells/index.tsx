import { TextInput } from '@components/ui/Inputs/TextInput.tsx';
import { Spell } from '@components/ui/Spells/Spell.tsx';
import { decode } from '@msgpack/msgpack';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useIndexedDB } from 'react-indexed-db-hook';
import { useTranslate } from '../../../contexts/Translator.tsx';
import { useCharacter } from '../../../hooks/useCharacter.ts';
export const Spells = () => {
    const { currentCharacter } = useCharacter();
    const { currentLocale, tokens } = useTranslate();
    const [filter, setFilter] = useState('');
    const [spells, setSpells] = useState<Spell[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { getByIndex } = useIndexedDB('spells');
    const [minimizedSpells, setMinimizedSpells] = useState<boolean[]>([]);
    const charSpells = currentCharacter.spells.map(
        (spellId) => spells.find((spell) => spell.id === spellId)!,
    );
    useEffect(() => {
        getByIndex('lang', currentLocale).then(
            (spell: { data: Uint8Array }) => {
                const spells = decode(spell.data) as Spell[];
                setSpells(spells);
                setMinimizedSpells(new Array(spells.length).fill(true));
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
                    <TextInput
                        value={filter}
                        onChange={(text) => setFilter(text)}
                        className={'!bg-white !font-Roboto'}
                        placeholder={tokens.UI.search}
                    />
                )}
                {charSpells
                    .filter(
                        (spell) =>
                            spell.name
                                .toLowerCase()
                                .includes(filter.toLowerCase()) ||
                            spell.originalName
                                ?.toLowerCase()
                                .includes(filter.toLowerCase()) ||
                            spell.level.toString() === filter,
                    )
                    .map((spell, index) => (
                        <Spell
                            key={spell.id}
                            spell={spell}
                            className='bg-[#ffffffdd]'
                            filter={filter}
                            minimized={minimizedSpells[index]}
                            onClick={() =>
                                setMinimizedSpells(
                                    minimizedSpells.toSpliced(
                                        index,
                                        1,
                                        !minimizedSpells[index],
                                    ),
                                )
                            }
                        />
                    ))}
            </div>
        )
    );
};
