import React from 'react';
import { useCharacter } from '../../../hooks/useCharacter.ts';

export interface InvisibleTextareaProps {
    stat: 'inventory' | 'notes';
}
export const InvisibleTextarea: React.FC<InvisibleTextareaProps> = ({
    stat,
}) => {
    const { currentCharacter, updateStat, saveCharacter } = useCharacter();
    const onChange = (text: string) => {
        saveCharacter(updateStat(stat, text));
    };
    return (
        <textarea
            value={currentCharacter[stat] ?? ''}
            onChange={(e) => onChange(e.target.value)}
            className={
                'bg-transparent font-Advent font-normal rounded-[4px] w-full h-full pt-[4px] pb-[4px] pl-[10px] pr-[10px] resize-none'
            }
        />
    );
};
