import { inactiveStyle } from '../../../constants/style-tokens.ts';
import { useTranslate } from '../../../contexts/Translator.tsx';
import { useCharacter } from '../../../hooks/useCharacter.ts';
import styles from './Notes.module.less';

export const Notes = () => {
    const { tokens } = useTranslate();
    const { isEdit } = useCharacter();
    return (
        <div
            className={styles.notes}
            style={isEdit ? inactiveStyle : undefined}
        >
            <h1>{tokens.notes.title}</h1>
        </div>
    );
};
