import { inactiveStyle } from '../../../constants/style-tokens.ts';
import { useTranslate } from '../../../contexts/Translator.tsx';
import { useCharacter } from '../../../hooks/useCharacter.ts';
import styles from './Lore.module.less';

export const MiniLore = () => {
    const { tokens } = useTranslate();
    const { isEdit } = useCharacter();
    return (
        <div
            className={styles.miniLore}
            style={isEdit ? inactiveStyle : undefined}
        >
            <ul className={styles.list}>
                <li>{tokens.miniLore.race}:</li>
                <li>{tokens.miniLore.class}:</li>
                <li>{tokens.miniLore.age}:</li>
                <li>{tokens.miniLore.height}:</li>
                <li>{tokens.miniLore.weight}:</li>
                <li>{tokens.miniLore.background}:</li>
                <li>{tokens.miniLore.languages}:</li>
            </ul>
        </div>
    );
};
