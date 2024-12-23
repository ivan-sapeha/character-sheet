import { Spell } from '@components/ui/Spells/Spell.tsx';
import { decode } from '@msgpack/msgpack';
import { useEffect, useState } from 'react';
import { useIndexedDB } from 'react-indexed-db-hook';
import { useTranslate } from '../../../contexts/Translator.tsx';
import { useCharacter } from '../../../hooks/useCharacter.ts';

export const Spells = () => {
    const { currentCharacter } = useCharacter();
    const { currentLocale } = useTranslate();
    const [spells, setSpells] = useState<Spell[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { getByIndex } = useIndexedDB('spells');

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
                {currentCharacter.spells.map((spellId) => (
                    <Spell
                        key={spellId}
                        spell={spells.find((spell) => spell.id === spellId)!}
                        className='bg-[#ffffffc9]'
                    />
                ))}
            </div>
        )
    );
};
