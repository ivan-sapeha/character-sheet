import { inactiveStyle } from '../../../constants/style-tokens.ts';
import { useTranslate } from '../../../contexts/Translator.tsx';
import { useCharacter } from '../../../hooks/useCharacter.ts';
import styles from './Weapons.module.less';

export const Weapon = () => {
    const { tokens } = useTranslate();
    const { isEdit } = useCharacter();
    return (
        <div
            className={styles.weapon}
            style={isEdit ? inactiveStyle : undefined}
        >
            <span>{tokens.weapons.name}:</span>
            <span>{tokens.weapons.attackBonus}:</span>
            <span>{tokens.weapons.damageType}:</span>
        </div>
    );
};
