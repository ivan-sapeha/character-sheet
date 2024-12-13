import styles from '@components/ui/Weapons/Weapons.module.less';
import React from 'react';
import { useTranslate } from '../../../contexts/Translator.tsx';
import { reactJoin } from '../../../helpers/generic-helpers.tsx';
import { useCharacter } from '../../../hooks/useCharacter.ts';

export const SpellTracker: React.FC = () => {
    const { tokens } = useTranslate();
    const { currentCharacter } = useCharacter();
    return (
        <div className={styles.weapon}>
            {tokens.weapons.spellSlots}:
            <div className={styles.spell}>
                {reactJoin(
                    Array(currentCharacter.manaSlots)
                        .fill(0)
                        .map((_, i) => (
                            <div className='flex flex-col flex-1 items-center'>
                                <span className='border-b border-b-black w-full text-center'>
                                    {i + 1}
                                </span>
                                <span className='h-[1.5em] border-b border-b-black w-[80%]'></span>
                                <span className='h-[1.5em]'></span>
                            </div>
                        )),
                    <span className='h-full w-[1px] bg-black' />,
                )}
            </div>
        </div>
    );
};
