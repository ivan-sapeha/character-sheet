import { A4Sheet, Player } from '@components/ui';
import { PassiveDescriptions } from '@components/ui/Additionals/Passives.tsx';
import { Death } from '@components/ui/Death';
import { FullStat } from '@components/ui/FullStat';
import { Inventory } from '@components/ui/Inventory/Inventory.tsx';
import { MiniLore } from '@components/ui/Lore/MiniLore.tsx';
import { Notes } from '@components/ui/Notes/Notes.tsx';
import { Passives } from '@components/ui/Statuses/Passives.tsx';
import { Skills } from '@components/ui/Statuses/Skills.tsx';
import { Speed } from '@components/ui/Statuses/Speed.tsx';
import { Weapons } from '@components/ui/Weapons';
import React, { useEffect, useState } from 'react';
import { useIndexedDB } from 'react-indexed-db-hook';
import { baseStats, statHelpers } from '../../../constants/char.ts';
import { fileToB64 } from '../../../helpers/convert.ts';
import { keys } from '../../../helpers/generic-helpers.tsx';
import { useCharacter } from '../../../hooks/useCharacter.ts';
import { usePassives } from '../../../hooks/usePassives.ts';

export const Sheet: React.FC<{ printing?: boolean }> = ({
    printing = false,
}) => {
    const { currentCharacter } = useCharacter();
    const { getByID } = useIndexedDB('background');
    const [background, setBackground] = useState('');
    const { passives } = usePassives();
    const shouldPrint = passives.some((passive) => !!passive.description);
    useEffect(() => {
        if (currentCharacter.backgroundImage !== -1) {
            getByID(currentCharacter.backgroundImage)
                .then((img) => img?.image && fileToB64(img.image))
                .then((bg) => bg && setBackground(bg as string))
                .catch(console.error);
        } else {
            setBackground('');
        }
    }, [currentCharacter]);

    return (
        <div className={'print'}>
            <A4Sheet background={background}>
                <div className='flex flex-col h-full gap-[5mm] items-center pt-[2mm]'>
                    <div className='flex h-full'>
                        <div className='flex flex-col gap-[2mm]'>
                            <Player character={currentCharacter} />
                            <MiniLore />
                            <Death />
                            <Weapons />
                        </div>
                        <div className='flex flex-col w-full gap-[5mm] h-full'>
                            <div className='flex justify-between w-full gap-[1mm]'>
                                {keys(baseStats).map((stat) => (
                                    <FullStat
                                        key={stat}
                                        data={currentCharacter.stats[stat]} //add merge with base
                                        color={
                                            statHelpers[
                                                stat as keyof typeof baseStats
                                            ].color
                                        }
                                        icon={
                                            statHelpers[
                                                stat as keyof typeof baseStats
                                            ].icon
                                        }
                                        name={stat}
                                    />
                                ))}
                            </div>
                            <div className='flex gap-[2mm]'>
                                <Speed />
                                <Skills />
                                <Passives />
                            </div>
                            <Inventory />
                            <Notes />
                        </div>
                    </div>
                </div>
            </A4Sheet>
            {printing && shouldPrint && <PassiveDescriptions />}
        </div>
    );
};
