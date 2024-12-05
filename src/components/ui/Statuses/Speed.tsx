import { inactiveStyle } from '../../../constants/style-tokens.ts';
import { useTranslate } from '../../../contexts/Translator.tsx';
import { useCharacter } from '../../../hooks/useCharacter.ts';
import styles from './Statuses.module.less';

export const Speed = () => {
    const { tokens } = useTranslate();
    const { isEdit } = useCharacter();
    return (
        <div
            className={styles.container}
            style={isEdit ? inactiveStyle : undefined}
        >
            <h1 className={styles.header}>{tokens.speed.title}</h1>
            <ul>
                <li>{tokens.speed.walk}:</li>
                <li>{tokens.speed.run}:</li>
                <li>{tokens.speed.climb}:</li>
                <li>{tokens.speed.swim}:</li>
            </ul>
        </div>
    );
};
