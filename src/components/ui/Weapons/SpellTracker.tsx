import styles from '@components/ui/Weapons/Weapons.module.less';
import React from 'react';
import { useTranslate } from '../../../contexts/Translator.tsx';
import { reactJoin } from '../../../helpers/react-join.tsx';

export const SpellTracker: React.FC<{
    levels: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
}> = ({ levels }) => {
    const { tokens } = useTranslate();
    return (
        <div className={styles.weapon}>
            {tokens.weapons.spellSlots}:
            <div className={styles.spell}>
                {reactJoin(
                    Array(levels)
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
