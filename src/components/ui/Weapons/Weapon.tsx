import { TextInput } from '@components/ui/Inputs/TextInput.tsx';
import cx from 'classnames';
import React from 'react';
import {
    emptyCharacter,
    Weapon as WeaponType,
} from '../../../constants/char.ts';
import { useTranslate } from '../../../contexts/Translator.tsx';
import { keys } from '../../../helpers/generic-helpers.tsx';
import { useCharacter } from '../../../hooks/useCharacter.ts';
import styles from './Weapons.module.less';

export const Weapon: React.FC<{ weaponIndex: number }> = ({ weaponIndex }) => {
    const { tokens } = useTranslate();
    return (
        <div className={styles.weapon}>
            <div className={'flex'}>
                <span className='text-nowrap'>{tokens.weapons.name}:</span>
                <EditableWeaponField weaponIndex={weaponIndex} field={'name'} />
            </div>
            <div className={'flex'}>
                <span className='text-nowrap'>
                    {tokens.weapons.attackBonus}:
                </span>
                <EditableWeaponField
                    weaponIndex={weaponIndex}
                    field={'bonus'}
                />
            </div>
            <div className={'flex'}>
                <span className='text-nowrap'>
                    {tokens.weapons.damageType}:
                </span>
                <EditableWeaponField
                    weaponIndex={weaponIndex}
                    field={'damage'}
                />
            </div>
        </div>
    );
};

const EditableWeaponField: React.FC<{
    field: keyof WeaponType;
    weaponIndex: number;
}> = ({ field, weaponIndex }) => {
    const { currentCharacter, isEdit, updateStat } = useCharacter();
    const weapons =
        currentCharacter.weapons instanceof Array
            ? currentCharacter.weapons
            : keys(currentCharacter.weapons).map(
                  (key) => currentCharacter.weapons[key],
              );
    return (
        <>
            {isEdit ? (
                <TextInput
                    className={'h-fit !p-0 font-Advent'}
                    value={
                        weapons[weaponIndex][field]?.toString() ??
                        emptyCharacter.weapons[weaponIndex][field].toString()
                    }
                    onChange={(text) =>
                        updateStat(
                            'weapons',
                            weapons.toSpliced(weaponIndex, 1, {
                                ...weapons[weaponIndex],
                                [field]: text,
                            }),
                        )
                    }
                />
            ) : (
                <span className={cx('font-Advent ')}>
                    {weapons[weaponIndex][field]?.toString() ??
                        emptyCharacter.weapons[weaponIndex][field].toString()}
                </span>
            )}
        </>
    );
};
