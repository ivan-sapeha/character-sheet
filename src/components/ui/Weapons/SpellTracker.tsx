import { EditableInput } from '@components/ui/Inputs/EditableInput.tsx';
import styles from '@components/ui/Weapons/Weapons.module.less';
import React, { useMemo } from 'react';
import { BaseStatValues } from '../../../constants/char.ts';
import { useTranslate } from '../../../contexts/Translator.tsx';
import { entries, reactJoin } from '../../../helpers/generic-helpers.tsx';
import { getModifier } from '../../../helpers/stats.ts';
import { useCharacter } from '../../../hooks/useCharacter.ts';

export const SpellTracker: React.FC = () => {
    const { tokens } = useTranslate();
    const { currentCharacter, isEdit, updateStat } = useCharacter();
    const baseStatMap = {
        intelligence: tokens.stats.intelligence,
        wisdom: tokens.stats.wisdom,
        charisma: tokens.stats.charisma,
    } as Record<BaseStatValues, string>;
    const defaultAB =
        currentCharacter.baseStat !== ''
            ? getModifier(
                  currentCharacter.stats[currentCharacter.baseStat]!.value,
              ) + Number(currentCharacter.proficiency || 0)
            : '';
    const defaultDC =
        currentCharacter.baseStat !== '' ? 8 + Number(defaultAB) : '';

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
            <div className='flex gap-[1mm] border-t border-black'>
                <div className='flex items-center'>
                    {tokens.weapons.baseStat}:
                    {isEdit ? (
                        <select
                            onChange={(e) =>
                                updateStat(
                                    'baseStat',
                                    (e.target.value as BaseStatValues) ?? '',
                                )
                            }
                            value={currentCharacter.baseStat as string}
                        >
                            {entries(baseStatMap).map(([statKey, statName]) => (
                                <option
                                    key={statName}
                                    value={statKey as string}
                                >
                                    {statName.substring(0, 3)}
                                </option>
                            ))}
                            <option value={''}>empty</option>
                        </select>
                    ) : (
                        <span className='w-fit pr-[1mm]'>
                            {currentCharacter.baseStat !== ''
                                ? baseStatMap[
                                      currentCharacter.baseStat
                                  ].substring(0, 3)
                                : ''}
                        </span>
                    )}
                </div>
                <div className={'border-l border-black pl-[1mm] pr-[1mm]'}>
                    {tokens.weapons.DC}:{' '}
                    <EditableInput
                        stat={'spellDc'}
                        defaultString={defaultDC.toString()}
                    />
                </div>
                <div className={'border-l border-black pl-[1mm] pr-[1mm]'}>
                    {tokens.weapons.AB}:{' '}
                    <EditableInput
                        stat={'attackBonus'}
                        defaultString={defaultAB.toString()}
                    />
                </div>
            </div>
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
