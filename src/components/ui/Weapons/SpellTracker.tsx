import styles from '@components/ui/Weapons/Weapons.module.less';
import React, { useMemo } from 'react';
import { useTranslate } from '../../../contexts/Translator.tsx';
import { reactJoin } from '../../../helpers/generic-helpers.tsx';
import { useCharacter } from '../../../hooks/useCharacter.ts';

export const SpellTracker: React.FC = () => {
    const { tokens } = useTranslate();
    const { currentCharacter } = useCharacter();
    const manaSlots = useMemo(
        () => (
            <>
                {reactJoin(
                    Array(currentCharacter.manaSlots)
                        .fill(0)
                        .map((_, i) => (
                            <div className='flex flex-col flex-1 items-center'>
                                <span className='border-b border-b-black w-full text-center'>
                                    {i + 1}
                                </span>
                                <Inputs manaSlot={i} />
                            </div>
                        )),
                    <span className='h-full w-[1px] bg-black' />,
                )}
            </>
        ),
        [currentCharacter.manaSlots],
    );
    return (
        <div className={styles.weapon}>
            {tokens.weapons.spellSlots}:
            <div className={styles.spell}>{manaSlots}</div>
        </div>
    );
};

const Inputs: React.FC<{ manaSlot: number }> = ({ manaSlot }) => {
    const { currentCharacter, updateStatLive } = useCharacter();
    return (
        <>
            <span className='h-[1.5em] border-b border-b-black w-[80%]'>
                <input
                    type='number'
                    value={currentCharacter.mana[manaSlot]?.current ?? ''}
                    className='bg-transparent border-none outline-0 w-full text-center font-Advent'
                    onChange={(e) =>
                        updateStatLive('mana', {
                            ...currentCharacter.mana,
                            [manaSlot]: {
                                max: currentCharacter.mana[manaSlot].max,
                                current: e.target.value,
                            },
                        })
                    }
                />
            </span>
            <span className='h-[1.5em]'>
                <input
                    type='number'
                    value={currentCharacter.mana[manaSlot]?.max ?? ''}
                    className='bg-transparent border-none outline-0 w-full text-center font-Advent'
                    onChange={(e) =>
                        updateStatLive('mana', {
                            ...currentCharacter.mana,
                            [manaSlot]: {
                                current:
                                    currentCharacter.mana[manaSlot].current,
                                max: e.target.value,
                            },
                        })
                    }
                />
            </span>
        </>
    );
};
