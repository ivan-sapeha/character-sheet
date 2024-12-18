import { SpellTracker } from '@components/ui/Weapons/SpellTracker.tsx';
import { Weapon } from '@components/ui/Weapons/Weapon.tsx';
import { useMemo } from 'react';
import { Weapon as WeaponType } from '../../../constants/char.ts';
import { inactiveStyle } from '../../../constants/style-tokens.ts';
import { useTranslate } from '../../../contexts/Translator.tsx';
import { keys } from '../../../helpers/generic-helpers.tsx';
import { useCharacter } from '../../../hooks/useCharacter.ts';
import styles from './Weapons.module.less';
import { isMobile } from 'react-device-detect';
export const Weapons = () => {
    const { tokens } = useTranslate();
    const { currentCharacter, isEdit } = useCharacter();
    const weaponsAmount =
        (currentCharacter.manaTracker ? 3 : 4) +
        (currentCharacter.showLore && !isMobile ? 0 : 3);

    const weapons = useMemo(() => {
        const weapons =
            currentCharacter.weapons instanceof Array
                ? currentCharacter.weapons
                : keys<{ [key: number]: WeaponType }>(
                      currentCharacter.weapons,
                  ).map((key) => currentCharacter.weapons[key]);
        return weapons
            .slice(0, weaponsAmount)
            .map((_, index) => (
                <Weapon key={`weapon-${index}`} weaponIndex={index} />
            ));
    }, [currentCharacter.showLore]);
    return (
        <div className={styles.weapons}>
            <div
                className={styles.title}
                style={isEdit ? inactiveStyle : undefined}
            >
                <h1>{tokens.weapons.title}</h1>
            </div>
            {currentCharacter.manaTracker && !isMobile && <SpellTracker />}
            {weapons}
        </div>
    );
};
