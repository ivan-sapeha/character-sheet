import { SpellTracker } from '@components/ui/Weapons/SpellTracker.tsx';
import { Weapon } from '@components/ui/Weapons/Weapon.tsx';
import { inactiveStyle } from '../../../constants/style-tokens.ts';
import { useTranslate } from '../../../contexts/Translator.tsx';
import { useCharacter } from '../../../hooks/useCharacter.ts';
import styles from './Weapons.module.less';

export const Weapons = () => {
    const { tokens } = useTranslate();
    const { currentCharacter, isEdit } = useCharacter();
    const weaponsAmount =
        (currentCharacter.manaTracker ? 3 : 4) +
        (currentCharacter.showLore ? 0 : 3);
    return (
        <div className={styles.weapons}>
            <div
                className={styles.title}
                style={isEdit ? inactiveStyle : undefined}
            >
                <h1>{tokens.weapons.title}</h1>
            </div>
            {currentCharacter.manaTracker && (
                <SpellTracker levels={currentCharacter.manaSlots} />
            )}
            {Array(weaponsAmount)
                .fill(0)
                .map((_, index) => (
                    <Weapon key={`weapon-${index}`} />
                ))}
        </div>
    );
};
