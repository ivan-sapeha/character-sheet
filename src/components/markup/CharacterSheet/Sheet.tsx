import { A4Sheet, Player } from '@components/ui';
import { PassiveDescriptions } from '@components/ui/Additionals/Passives.tsx';
import { Death } from '@components/ui/Death';
import { FullStat } from '@components/ui/FullStat';
import { Inventory } from '@components/ui/Inventory/Inventory.tsx';
import { MiniLore } from '@components/ui/Lore/MiniLore.tsx';
import { Notes } from '@components/ui/Notes/Notes.tsx';
import { Spells } from '@components/ui/Spells';
import { Passives } from '@components/ui/Statuses/Passives.tsx';
import { Skills } from '@components/ui/Statuses/Skills.tsx';
import { Speed } from '@components/ui/Statuses/Speed.tsx';
import { Weapons } from '@components/ui/Weapons';
import { SpellTracker } from '@components/ui/Weapons/SpellTracker.tsx';
import cx from 'classnames';
import React, { useEffect, useState } from 'react';
import { useIndexedDB } from 'react-indexed-db-hook';
import { baseStats, statHelpers } from '../../../constants/char.ts';
import { fileToB64 } from '../../../helpers/convert.ts';
import { keys } from '../../../helpers/generic-helpers.tsx';
import { useCharacter } from '../../../hooks/useCharacter.ts';
import { usePassives } from '../../../hooks/usePassives.ts';
import { BrowserView, MobileView, isMobile } from 'react-device-detect';
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
                .then((bg) => bg && setBackground(`url(${bg})`))
                .catch(console.error);
        } else {
            setBackground('');
        }
    }, [currentCharacter.backgroundImage]);

    return (
        <div className={'print'}>
            <A4Sheet
                backgroundImage={background}
                className={cx({
                    '!w-[100vw] !h-fit !bg-150%': isMobile,
                })}
            >
                <BrowserView className='h-full'>
                    <div className='flex flex-col h-full gap-[5mm] items-center'>
                        <div className='flex h-full'>
                            <div className='flex flex-col gap-[1mm]'>
                                <Player character={currentCharacter} />
                                {(currentCharacter.showLore ?? true) && (
                                    <div className='max-w-[52mm]'>
                                        <MiniLore />
                                    </div>
                                )}
                                <Death />
                                <Weapons />
                            </div>
                            <div className='flex flex-col w-full gap-[5mm]'>
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
                                <div className='flex gap-[2mm] w-[585px]'>
                                    {(currentCharacter.showSpeed ?? true) && (
                                        <Speed />
                                    )}
                                    <Skills />
                                    <Passives />
                                </div>
                                <div className='grid grid-rows-2 gap-[5mm] h-full'>
                                    <Inventory />
                                    <Notes />
                                </div>
                            </div>
                        </div>
                    </div>
                </BrowserView>
                <MobileView>
                    <div className='flex flex-col items-center gap-[2mm]'>
                        <div className='flex justify-around w-full'>
                            <div>
                                <Player character={currentCharacter} />
                                <div className={'w-[50mm]'}>
                                    <Death />
                                </div>
                            </div>
                            <div className='flex flex-col justify-around items-center'>
                                <Skills />
                                <SpellTracker />
                            </div>
                        </div>
                        <div className='grid grid-cols-3 justify-items-center w-full gap-[2mm] flex-wrap'>
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
                        <Passives />
                        <div className='h-[70vh] w-full grid grid-rows-2 gap-[3mm]'>
                            <Inventory />
                            <Notes />
                        </div>
                        <Weapons />
                        {(currentCharacter.showLore ?? true) && (
                            <div className={'w-[60mm]'}>
                                <MiniLore />
                            </div>
                        )}
                        <Spells />
                    </div>
                </MobileView>
            </A4Sheet>
            {printing && shouldPrint && <PassiveDescriptions />}
        </div>
    );
};
