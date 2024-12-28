import { EditableInput } from '@components/ui/Inputs/EditableInput.tsx';
import styles from '@components/ui/Weapons/Weapons.module.less';
import cx from 'classnames';
import React, { useMemo } from 'react';
import { BaseStatValues, MaxCurrent } from '../../../constants/char.ts';
import { useTranslate } from '../../../contexts/Translator.tsx';
import { entries, keys, reactJoin } from '../../../helpers/generic-helpers.tsx';
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
                    <span className='w-[1px] bg-black' />,
                )}
            </>
        ),
        [currentCharacter.manaSlots],
    );
    return (
        <div className={cx(styles.weapon, 'max-w-[310px]')}>
            {tokens.weapons.spellSlots}:
            <div className={styles.spell}>{manaSlots}</div>
            <div className='flex gap-[1mm] border-t border-black justify-around'>
                <div className='flex items-center justify-center gap-[1mm] pt-[0.5mm]'>
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
                            className={
                                'bg-transparent border border-black rounded'
                            }
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
                <div className={'flex gap-[1mm]'}>
                    {tokens.weapons.DC}:{' '}
                    <EditableInput
                        className={'!p-0'}
                        stat={'spellDc'}
                        defaultString={defaultDC.toString()}
                    />
                </div>
                <div className={'flex gap-[1mm]'}>
                    {tokens.weapons.AB}:{' '}
                    <EditableInput
                        className={'!p-0'}
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
    const mana =
        currentCharacter.mana instanceof Array
            ? currentCharacter.mana
            : keys<{ [key: number]: MaxCurrent }>(currentCharacter.mana).map(
                  (key) => currentCharacter.mana[key],
              );
    return (
        <>
            <span className='h-[1.5em] border-b border-b-black w-[80%]'>
                <input
                    type='number'
                    value={mana[manaSlot]?.current ?? ''}
                    className='bg-transparent border-none outline-0 w-full text-center font-Advent'
                    onChange={(e) =>
                        updateStatLive(
                            'mana',
                            mana.toSpliced(manaSlot, 1, {
                                max: mana[manaSlot].max,
                                current: e.target.value,
                            }),
                        )
                    }
                />
            </span>
            <span className='h-[1.5em]'>
                <input
                    type='number'
                    value={mana[manaSlot]?.max ?? ''}
                    className='bg-transparent border-none outline-0 w-full text-center font-Advent'
                    onChange={(e) =>
                        updateStatLive(
                            'mana',
                            mana.toSpliced(manaSlot, 1, {
                                current: mana[manaSlot].current,
                                max: e.target.value,
                            }),
                        )
                    }
                />
            </span>
        </>
    );
};
